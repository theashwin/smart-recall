from django.http import JsonResponse
from .models import Recall, Graph


def recall(request):
	selection = request.GET.get("id", None)
	return JsonResponse(Recall().get_related_notes(selection))


def graph(request):
	title = request.GET.get("title", "")
	desc = request.GET.get("desc", "")
	selection = request.GET.get("selection", "")
	results = request.GET.get("results", 20)
	return JsonResponse(Graph(results).get_graph(title, desc, selection, results))
