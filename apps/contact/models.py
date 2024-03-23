from django.db import models

# Create your models here.
class contact(models.Model):
    instagramm = models.URLField(max_length=255, verbose_name="instagramm")
    phone = models.CharField(max_length=255, verbose_name="phone")
    email = models.EmailField(max_length=200, verbose_name="email")
    photo = models.ImageField(upload_to = 'contact', verbose_name = 'contact_photo' )
    street = models.CharField(max_length=255, verbose_name="Название")