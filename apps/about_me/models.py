from distutils.text_file import TextFile
from tkinter import Image
from django.db import models

# CreateNode your models here.
class about_me(models.Model):
       Image1 = models.ImageField(upload_to="about_me", verbose_name="logo",)
       about_page = models.TextField(verbose_name="Страница 'О нас'", null=True, blank=True)


def __str__(self):
    return self.image1
    
class Meta:
    verbose_name_plural = 'aboutme'    