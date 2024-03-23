from django.db import models

# Create your models here.
class intro(models.Model):
    title = models.CharField(max_length=255, verbose_name="Название")
    image = models.ImageField(upload_to="intro", verbose_name="Фото")
    Image1 = models.ImageField(upload_to="about_me", verbose_name="logo",)
    about_page = models.TextField(verbose_name="Страница 'О нас'", null=True, blank=True)
    icon = models.ImageField(upload_to="intro", verbose_name="icon1")


    def __str__ (self):
        return self.title


    class  Meta:
        verbose_name = 'intro'
        verbose_name_plural = 'intros'
