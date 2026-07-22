from django.shortcuts import render
from apps.intro.models import intro
from apps.contact.models import contact
from apps.my_portfolio.models import PortfolioProject

def index(request):
    setting = intro.objects.last()
    contacts = contact.objects.last()
    projects = PortfolioProject.objects.all()

    context = {
        'setting': setting,
        'contacts': contacts,
        'projects': projects,
    }
    return render(request, 'index.html', context)

  