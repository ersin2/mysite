from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.core.cache import cache
import html
from apps.contact.models import ContactMessage


def contact_view(request):
    return render(request, 'index.html', {})


@require_POST
def send_message(request):
    # --- Rate Limiting (Max 3 messages per IP per hour) ---
    ip = request.META.get('REMOTE_ADDR', 'unknown')
    cache_key = f'contact_limit_{ip}'
    attempts = cache.get(cache_key, 0)
    
    if attempts >= 3:
        return JsonResponse({
            'status': 'error',
            'message': 'Too many requests. Please try again later.'
        }, status=429)

    # --- Input Sanitization and Extraction ---
    name = html.escape(request.POST.get('name', '').strip())
    email = html.escape(request.POST.get('email', '').strip())
    message = html.escape(request.POST.get('message', '').strip())

    # --- Strict Validation ---
    if not name or not email or not message:
        return JsonResponse({
            'status': 'error',
            'message': 'All fields (Name, Email, Message) are required.'
        }, status=400)

    if len(name) > 100 or len(email) > 150 or len(message) > 5000:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid input length. Please shorten your message.'
        }, status=400)

    # --- Save and Update Cache ---
    ContactMessage.objects.create(
        name=name,
        email=email,
        message=message
    )
    
    # Increment cache and set timeout for 1 hour (3600s)
    cache.set(cache_key, attempts + 1, 3600)

    return JsonResponse({
        'status': 'success',
        'message': 'Message transmitted successfully.'
    })