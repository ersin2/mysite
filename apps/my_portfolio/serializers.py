from rest_framework import serializers
from .models import PortfolioProject

class PortfolioProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioProject
        fields = ['id', 'title', 'description', 'image', 'tech_tags', 'github_url', 'live_url', 'created_at']
