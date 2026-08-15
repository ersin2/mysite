from django.contrib import admin
from apps.contact.models import SiteContactInfo, ContactMessage


@admin.register(SiteContactInfo)
class SiteContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'instagram_url', 'location')
    search_fields = ('email', 'phone', 'location')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')