from django.shortcuts import render
from apps.intro.models import intro
from apps.contact.models import contact

def index(request):
    setting = intro.objects.latest('id')
    contacts = contact.objects.latest('id')
    context = {
        'setting' : setting,
        'contacts' : contacts,
    }
    return render(request,'index.html', context)
  