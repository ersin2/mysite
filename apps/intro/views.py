from django.shortcuts import render
from django.views.decorators.cache import cache_page
from apps.intro.models import intro
from apps.contact.models import contact
from apps.my_portfolio.models import PortfolioProject

@cache_page(60 * 15) # Cache for 15 minutes
def index(request):
    projects = PortfolioProject.objects.all()

    context = {
        'projects': projects,
    }
    return render(request, 'index.html', context)

  