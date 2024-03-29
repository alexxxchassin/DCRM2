import json
import datetime
import time
import random

from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response

import okcupyd

from dg.models import User, ExtraData
from dg.forms import UsernamePasswordForm, IdAndAuthForm, ExtraDataForm

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

def getExtraDataFromCache(username, extraDataCache):
	for extraData in extraDataCache:
		if extraData.other_username == username:
			return json.loads(extraData.data_json)
	return None

def getData(user, okcUser, start, num, extraDataCache):
	jsonData = list()

	count = 0
	pos = start

	while count < num:
		inbox = okcUser.inbox[pos]
		userEntry = dict()
		userEntry['username'] = inbox.correspondent
		userEntry['service'] = "okc"

		try:
			userEntry['gender'] = inbox.correspondent_profile.gender

			try:
				photoInfos = inbox.correspondent_profile.photo_infos
			except:
				photoInfos = list()
					
			if len(photoInfos) > 0:
				userEntry['profile_url'] = photoInfos[0].jpg_uri
			else:
				userEntry['profile_url'] = "http://upload.wikimedia.org/wikipedia/commons/c/c7/Puppy_on_Halong_Bay.jpg"

			messages = list()
			if inbox.has_messages:
				for msg in inbox.messages:
					msgEntry = dict()
					msgEntry['sender'] = msg.sender.username
					msgEntry['content'] = msg.content
					msgEntry['time_stamp'] = msg.time_sent

					messages.append(msgEntry)
			userEntry['messages'] = messages

			extraData = getExtraDataFromCache(inbox.correspondent, extraDataCache)
			if extraData:
				for key, value in extraData.iteritems():
					userEntry[key] = value

			jsonData.append(userEntry)
			count += 1
		except:
			pass
		pos += 1

	return jsonData


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
	else:
		return HttpResponse(json.dumps(form.errors), content_type="application/json", status=400)

	return HttpResponse(json.dumps(response), content_type="application/json")

@jsonp
def update(request):
	response = dict({'result': True})
	form = ExtraDataForm(getRequestData(request))

	if (form.is_valid()):
		userId = form.cleaned_data['id']
		authcode = form.cleaned_data['authcode']
		other_username = form.cleaned_data['other_username']
		data_json = form.cleaned_data['data_json']

		try:
			user = User.objects.get(id=userId, authcode=authcode)
		except User.DoesNotExist:
			response['result'] = False
			response['error'] = "Id and auth code invalid"
			return HttpResponse(json.dumps(response), content_type="application/json")

		try:
			extraData = ExtraData.objects.get(user=user, other_username=other_username)
		except ExtraData.DoesNotExist:
			extraData = ExtraData(user=user, other_username=other_username)

		try:
			data = json.loads(data_json)
			extraData.data_json = data_json
			extraData.save()

			response["other_username"] = other_username
			for key,value in data.iteritems():
				response[key] = value
		except Exception, e:
			response["result"] = False
			response["error"] = "Could not decode data_json: %s" % e

	else:
		return HttpResponse(json.dumps(form.errors), content_type="application/json", status=400)

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
		start = form.cleaned_data['start']
		num = form.cleaned_data['num']

		if not start:
			start = 0
		if not num:
			num = 5

		try:
			user = User.objects.get(id=userId, authcode=authcode)
		except User.DoesNotExist:
			response['result'] = False
			response['error'] = "Id and auth code invalid"
			return HttpResponse(json.dumps(response), content_type="application/json")

		session = okcupyd.Session.login(user.username, user.password)
		okcUser = okcupyd.User(session)

		extraDataCache = ExtraData.objects.filter(user=user)

		response['users'] = getData(user, okcUser, start, num, extraDataCache)
		response['loggedinuser'] = user.username
	else:
		return HttpResponse(json.dumps(form.errors), content_type="application/json", status=400)

	return HttpResponse(json.dumps(response, cls=DCRMJsonEncoder), content_type="application/json")


