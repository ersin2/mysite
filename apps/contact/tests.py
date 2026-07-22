import pytest
from django.urls import reverse
from django.core.cache import cache
from apps.contact.models import ContactMessage

@pytest.fixture(autouse=True)
def clear_cache():
    cache.clear()

@pytest.mark.django_db
class TestContactForm:
    
    def test_successful_submission(self, client):
        url = reverse('send_message')
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'This is a valid message.'
        }
        response = client.post(url, data)
        assert response.status_code == 200
        assert response.json()['status'] == 'success'
        assert ContactMessage.objects.count() == 1

    def test_missing_fields(self, client):
        url = reverse('send_message')
        data = {
            'name': 'Test User',
            # missing email and message
        }
        response = client.post(url, data)
        assert response.status_code == 400
        assert response.json()['status'] == 'error'
        assert ContactMessage.objects.count() == 0

    def test_rate_limiter(self, client):
        url = reverse('send_message')
        data = {
            'name': 'Spammer',
            'email': 'spam@example.com',
            'message': 'Spam message'
        }
        
        # Send 3 successful messages (the limit)
        for _ in range(3):
            res = client.post(url, data, REMOTE_ADDR='192.168.1.100')
            assert res.status_code == 200
            
        # 4th message should be blocked by rate limiter
        res_blocked = client.post(url, data, REMOTE_ADDR='192.168.1.100')
        assert res_blocked.status_code == 429
        assert 'Too many requests' in res_blocked.json()['message']
        
        # Another IP should still be allowed
        res_other_ip = client.post(url, data, REMOTE_ADDR='192.168.1.101')
        assert res_other_ip.status_code == 200

    def test_length_validation(self, client):
        url = reverse('send_message')
        data = {
            'name': 'A' * 101,  # Too long (max 100)
            'email': 'test@example.com',
            'message': 'Valid message.'
        }
        response = client.post(url, data)
        assert response.status_code == 400
        assert 'Invalid input length' in response.json()['message']
