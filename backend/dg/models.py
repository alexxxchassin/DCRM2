from django.db import models

# Create your models here.

# Create your models here.
class User(models.Model):
	username = models.CharField(max_length=100)
	authcode = models.CharField(max_length=100)
	service = models.CharField(max_length=100, default="okc")
	data_json = models.TextField(null=True)