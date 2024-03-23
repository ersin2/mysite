from django.shortcuts import render
from apps.home.models import home


# Create your views here.
def index(request):
    set = home.objects.latest('id')
    context= {
        'home' : set,
    }
    return render(request, 'index.html', context)
