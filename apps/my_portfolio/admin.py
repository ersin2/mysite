from django.contrib import admin
from apps.my_portfolio.models import PortfolioProject

@admin.register(PortfolioProject)
class PortfolioProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech_tags', 'created_at')
    search_fields = ('title', 'description', 'tech_tags')

