from django.db import models


class SiteContactInfo(models.Model):
    """
    Singleton model representing the site owner's contact and availability information.
    """
    email = models.EmailField(max_length=200, verbose_name="Contact Email")
    phone = models.CharField(max_length=50, blank=True, verbose_name="Phone Number")
    instagram_url = models.URLField(max_length=255, blank=True, verbose_name="Instagram URL")
    github_url = models.URLField(max_length=255, blank=True, verbose_name="GitHub URL")
    location = models.CharField(max_length=255, blank=True, verbose_name="Location / Working Hours")

    def __str__(self):
        return f"Site Contact Info ({self.email})"

    class Meta:
        verbose_name = "Site Contact Info"
        verbose_name_plural = "Site Contact Info"


class ContactMessage(models.Model):
    """
    Inbound messages submitted via the portfolio contact form.
    """
    name = models.CharField(max_length=150, verbose_name="Name")
    email = models.EmailField(verbose_name="Email")
    message = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Received At")
    is_read = models.BooleanField(default=False, verbose_name="Is Read")

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']