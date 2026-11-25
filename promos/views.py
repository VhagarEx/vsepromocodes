from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods, require_safe

from .forms import OfferForm
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
def offer_detail(request):
    try:
        pk = int(request.GET.get("id", ""))
    except ValueError:
        return render(request, "offer_not_found.html", status=404)

    offer = Offer.objects.select_related("store").filter(pk=pk).first() if 0 < pk < 2**63 else None
    if offer is None:
        return render(request, "offer_not_found.html", status=404)

    return render(request, "offer_detail.html", {
        "offer": offer,
        "offers": serialize_offers([offer]),
    })


@require_safe
def offer_management(request):
    return render(request, "offer_management.html", {
        "offers": Offer.objects.select_related("store"),
    })


@require_http_methods(["GET", "POST"])
def offer_create(request):
    return edit_form(request, "Добавить предложение")


@require_http_methods(["GET", "POST"])
def offer_edit(request, pk):
    offer = Offer.objects.filter(pk=pk).first()
    if offer is None:
        return render(request, "offer_not_found.html", status=404)
    return edit_form(request, "Редактировать предложение", offer)


def edit_form(request, heading, offer=None):
    form = OfferForm(request.POST if request.method == "POST" else None, instance=offer)
    if request.method == "POST" and form.is_valid():
        saved = form.save()
        return redirect(reverse("offer-detail", query={"id": saved.pk}))
    return render(request, "offer_form.html", {"form": form, "heading": heading})


@require_http_methods(["GET", "POST"])
def offer_delete(request, pk):
    offer = Offer.objects.select_related("store").filter(pk=pk).first()
    if offer is None:
        return render(request, "offer_not_found.html", status=404)

    if request.method == "POST":
        offer.delete()
        return redirect("offer-management")

    return render(request, "offer_confirm_delete.html", {"offer": offer})
