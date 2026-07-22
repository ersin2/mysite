from django.contrib import admin
from apps.contact.models import contact, ContactMessage

@admin.register(contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'instagramm', 'street')
    search_fields = ('email', 'phone', 'street')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')
