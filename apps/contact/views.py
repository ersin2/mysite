from django.shortcuts import render
from apps.contact.models import contact

# Create your views here.
def contact (request):
    setting = contact.objects.latest('id')
    context = {
        'setting' : setting
    }
    return render(request,'index.html', context)
  