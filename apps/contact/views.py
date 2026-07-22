from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from apps.contact.models import contact, ContactMessage

def contact_view(request):
    setting = contact.objects.last()
    context = {
        'setting': setting
    }
    return render(request, 'index.html', context)

@require_POST
def send_message(request):
    name = request.POST.get('name', '').strip()
    email = request.POST.get('email', '').strip()
    message = request.POST.get('message', '').strip()

    if not name or not email or not message:
        return JsonResponse({
            'status': 'error',
            'message': 'All fields (Name, Email, Message) are required.'
        }, status=400)

    ContactMessage.objects.create(
        name=name,
        email=email,
        message=message
    )

    return JsonResponse({
        'status': 'success',
        'message': 'Message transmitted successfully.'
    })

  