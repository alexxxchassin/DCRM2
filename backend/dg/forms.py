from django import forms

from dg.models import User



class UsernamePasswordForm(forms.Form):
	username = forms.CharField()
	password = forms.CharField()

class IdAndAuthForm(forms.Form):
	id = forms.IntegerField(min_value=0)
	authcode = forms.CharField()