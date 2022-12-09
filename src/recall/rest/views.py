from django.http import JsonResponse
from .models import Recall


def recall(request):
	selection = request.GET.get("id", None)
	return JsonResponse(Recall().get_related_notes(selection))
