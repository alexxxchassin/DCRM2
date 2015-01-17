import json
import datetime
import time

from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response

import okcupyd

from dg.models import User
from dg.forms import UsernamePasswordForm, IdAndAuthForm

def jsonp(f):
    """Wrap a json response in a callback, and set the mimetype (Content-Type) header accordingly 
    (will wrap in text/javascript if there is a callback). If the "callback" or "jsonp" paramters 
    are provided, will wrap the json output in callback({thejson})
    
    Usage:
    
    @jsonp
    def my_json_view(request):
        d = { 'key': 'value' }
        return HTTPResponse(json.dumps(d), content_type='application/json')
    
    """
    from functools import wraps
    @wraps(f)
    def jsonp_wrapper(request, *args, **kwargs):
        resp = f(request, *args, **kwargs)
        if resp.status_code != 200:
            return resp
        if 'callback' in request.GET:
            callback= request.GET['callback']
            resp['Content-Type']='text/javascript; charset=utf-8'
            resp.content = "%s(%s)" % (callback, resp.content)
            return resp
        elif 'jsonp' in request.GET:
            callback= request.GET['jsonp']
            resp['Content-Type']='text/javascript; charset=utf-8'
            resp.content = "%s(%s)" % (callback, resp.content)
            return resp
        else:
            return resp                
                
    return jsonp_wrapper

def getRequestData(request):
	if request.method == 'GET':
		data = request.GET
	elif request.method == 'POST':
		data = request.POST

	return data

class DCRMJsonEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.datetime):
			return int(time.mktime(obj.timetuple()))

		if isinstance(obj, PhoneNumber):
			return str(obj)

		if isinstance(obj, Point):
			return str(obj)

			
		return json.JSONEncoder.default(self, obj)

def populateData(user, okcUser):
	jsonData = list()
	for inbox in okcUser.inbox[:30]:
		userEntry = dict()
		userEntry['username'] = inbox.correspondent
		userEntry['service'] = "okc"
		userEntry['profile_url'] = "http://upload.wikimedia.org/wikipedia/commons/c/c7/Puppy_on_Halong_Bay.jpg"
		#profile = inbox.correspondent_profile
		#print profile.id
		messages = list()
		if inbox.has_messages:
			for msg in inbox.messages:
				msgEntry = dict()
				msgEntry['sender'] = msg.sender.username
				msgEntry['content'] = msg.content
				msgEntry['time_stamp'] = msg.time_sent

				messages.append(msgEntry)
		userEntry['messages'] = messages

		jsonData.append(userEntry)

	user.data_json = json.dumps(jsonData, cls=DCRMJsonEncoder)
	user.save()

@jsonp
def login(request):
	response = dict({'result': True})
	form = UsernamePasswordForm(getRequestData(request))

	if (form.is_valid()):
		username = form.cleaned_data['username']
		password = form.cleaned_data['password']

		try:
			session = okcupyd.Session.login(username, password)
			okcUser = okcupyd.User(session)
		except:
			response['result'] = False
			response['error'] = "Username and password invalid"
			return HttpResponse(json.dumps(response), content_type="application/json")

		try:
			user = User.objects.get(username=username)
		except User.DoesNotExist:
			user = User.objects.create(username=username, password=password, service="okc", authcode = '%s' % random.randrange(1000, 10000))

		response['id'] = user.id
		response['authcode'] = user.authcode
		if not user.data_json:
			populateData(user, okcUser)

	else:
		return HttpResponse(json.dumps(form.errors), content_type="application/json", status=400)

	return HttpResponse(json.dumps(response), content_type="application/json")

# Create your views here.
@jsonp
def generate(request):
	response = dict()

	response['result'] = True

	requestData = getRequestData(request)

	userId = requestData['id']

	user = User.objects.get(id=userId)
	session = okcupyd.Session.login(user.username, user.password)
	okcUser = okcupyd.User(session)
	
	populateData(user, okcUser)
	
	return HttpResponse(json.dumps(response, cls=DCRMJsonEncoder), content_type="application/json")

def main(request):
   return render_to_response('dcrm/main.html')

@jsonp
def data(request):
	response = dict({'result': True})
	form = IdAndAuthForm(getRequestData(request))

	if (form.is_valid()):
		userId = form.cleaned_data['id']
		authcode = form.cleaned_data['authcode']

		try:
			user = User.objects.get(id=userId, authcode=authcode)
		except User.DoesNotExist:
			response['result'] = False
			response['error'] = "Id and auth code invalid"
			return HttpResponse(json.dumps(response), content_type="application/json")

		response['users'] = json.loads(user.data_json)

	else:
		return HttpResponse(json.dumps(form.errors), content_type="application/json", status=400)

	return HttpResponse(json.dumps(response), content_type="application/json")


