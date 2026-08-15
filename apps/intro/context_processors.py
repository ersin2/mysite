from apps.intro.models import intro
from apps.contact.models import SiteContactInfo


def global_settings(request):
    """
    Injects global settings and contact info into all templates.
    """
    try:
        global_setting = intro.objects.last()
        global_contacts = SiteContactInfo.objects.last()
    except Exception:
        global_setting = None
        global_contacts = None

    return {
        'global_setting': global_setting,
        'global_contacts': global_contacts,
    }
