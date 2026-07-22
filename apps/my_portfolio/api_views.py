from rest_framework import viewsets
from .models import PortfolioProject
from .serializers import PortfolioProjectSerializer

class PortfolioProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows projects to be viewed.
    """
    queryset = PortfolioProject.objects.all().order_by('-created_at')
    serializer_class = PortfolioProjectSerializer
