from django.db import models

# Create your models here.
class contact(models.Model):
    instagramm = models.URLField(max_length=255, verbose_name="instagramm")
    phone = models.CharField(max_length=255, verbose_name="phone")
    email = models.EmailField(max_length=200, verbose_name="email")
    photo = models.ImageField(upload_to = 'contact', verbose_name = 'contact_photo' )
    street = models.CharField(max_length=255, verbose_name="Название")

class ContactMessage(models.Model):
    name = models.CharField(max_length=150, verbose_name="Name")
    email = models.EmailField(verbose_name="Email")
    message = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    is_read = models.BooleanField(default=False, verbose_name="Is Read")

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']