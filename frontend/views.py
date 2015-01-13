import json
import datetime
import time

from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render_to_response

import okcupyd



class DCRMJsonEncoder(json.JSONEncoder):
	def default(self, obj):
		if isinstance(obj, datetime.datetime):
			return int(time.mktime(obj.timetuple()))

		if isinstance(obj, PhoneNumber):
			return str(obj)

		if isinstance(obj, Point):
			return str(obj)

			
		return json.JSONEncoder.default(self, obj)


# Create your views here.
def messages(request):
	response = dict()

	response['result'] = True


	session = okcupyd.Session.login('gregnyc2014', 'greg55')
	user = okcupyd.User(session)
	
	response['messages'] = dict()

	for inbox in user.inbox[:8]:
		profile = inbox.correspondent_profile
		#print profile.id
		messages = list()
		if inbox.has_messages:
			for msg in inbox.messages:
				entry = dict()
				entry['sender'] = msg.sender.username
				entry['content'] = msg.content
				entry['time_stamp'] = msg.time_sent

				messages.append(entry)
		response['messages'][inbox.correspondent] = messages


	return HttpResponse(json.dumps(response, cls=DCRMJsonEncoder), content_type="application/json")

def main(request):
   return render_to_response('dcrm/main.html')

def data(request):
	json_data = open('frontend/data1.json')   
	data1 = json.load(json_data)

	return HttpResponse(json.dumps(data1), content_type="application/json")


