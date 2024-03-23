from django.db import models

# Create your models here.
class about_us(models.Model):
    title = models.CharField(max_length=250)
    title2 = models.CharField(max_length=250)
    title3 = models.CharField(max_length=250)
    title4 = models.CharField(max_length=250)
    decription = models.TextField()
    decription2 = models.TextField()
    decription3 = models.TextField()
    decription4 = models.TextField()
    decription5 = models.TextField()
    decription6 = models.TextField()
    decription7 = models.TextField()
    decription8 = models.TextField()
    image1 = models.ImageField(upload_to='Image1/')
    image2 = models.ImageField(upload_to='Image2/')
    image3 = models.ImageField(upload_to='Image3/')
    image4 = models.ImageField(upload_to='Image4/')
    def __str__(self):
        return self.title 


    class Meta:
        verbose_name = "about_us"
        verbose_name_plural = "about_us"    
