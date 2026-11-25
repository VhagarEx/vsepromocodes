from django.shortcuts import render
from django.views.decorators.http import require_safe

from .models import Offer


def serialize_offers(queryset):
    return [
        {
            "id": offer.pk,
            "store": offer.store.slug,
            "type": offer.type,
            "discount": offer.discount,
            "title": offer.title,
            "terms": offer.terms,
            "expires": offer.expires.isoformat(),
            "code": offer.code,
            "url": offer.url,
        }
        for offer in queryset
    ]


@require_safe
def home(request):
    return render(request, "home.html", {
        "offers": serialize_offers(Offer.objects.select_related("store")),
    })


@require_safe
def catalog(request):
    return render(request, "catalog.html", {
        "offers": serialize_offers(Offer.objects.select_related("store")),
    })


@require_safe
def store_page(request):
    offers = Offer.objects.select_related("store").filter(store__slug=request.GET.get("store", ""))
    return render(request, "store.html", {"offers": serialize_offers(offers)})


@require_safe
def register(request):
    return render(request, "register.html")


@require_safe
def login(request):
    return render(request, "login.html")
