from django.db import models

# Create your models here.
class home(models.Model):
    title = models.CharField(max_length=250)
    title2 = models.CharField(max_length=250)
    title3 = models.CharField(max_length=250)
    title4 = models.CharField(max_length=250)
    title5 = models.CharField(max_length=250)
    title6 = models.CharField(max_length=250)
    title7 = models.CharField(max_length=250)
    title8 = models.CharField(max_length=250)
    decription = models.TextField()
    decription2 = models.TextField()
    decription3 = models.TextField()
    decription4 = models.TextField()
    decription5 = models.TextField()
    decription6 = models.TextField()
    decription7 = models.TextField()
    decription8 = models.TextField()
    logo = models.ImageField(upload_to = 'logo/')
    

    def __str__ (self):
        return self.title

    class Meta:
        verbose_name_plural = "setting "
            