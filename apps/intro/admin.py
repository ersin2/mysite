from django.contrib import admin
from apps.intro.models import intro

@admin.register(intro)
class IntroAdmin(admin.ModelAdmin):
    list_display = ('title', 'about_page')
    search_fields = ('title',)