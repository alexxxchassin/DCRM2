from django import forms

from dg.models import User



class UsernamePasswordForm(forms.Form):
	username = forms.CharField()
	password = forms.CharField()

class IdAndAuthForm(forms.Form):
	id = forms.IntegerField(min_value=0)
	authcode = forms.CharField()
	start = forms.IntegerField(min_value=0, required=False)
	num = forms.IntegerField(min_value=0, required=False)

class ExtraDataForm(forms.Form):
	id = forms.IntegerField(min_value=0)
	authcode = forms.CharField()
	other_username = forms.CharField()
	data_json = forms.CharField()