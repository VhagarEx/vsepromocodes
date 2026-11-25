from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods, require_safe

from .forms import ReportForm
from .models import Offer, Report


@login_required
@require_safe
def report_list(request):
    reports = Report.objects.filter(user=request.user).select_related("offer__store")
    return render(request, "reports/list.html", {"reports": reports})


@login_required
@require_safe
def report_detail(request, pk):
    report = get_object_or_404(
        Report.objects.select_related("offer__store"), pk=pk, user=request.user
    )
    return render(request, "reports/detail.html", {"report": report})


@login_required
@require_http_methods(["GET", "POST"])
def report_create(request, offer_id):
    offer = get_object_or_404(Offer, pk=offer_id)
    form = ReportForm(request.POST if request.method == "POST" else None)
    if request.method == "POST" and form.is_valid():
        report = form.save(commit=False)
        report.user = request.user
        report.offer = offer
        report.save()
        return redirect("report-detail", pk=report.pk)
    return render(request, "reports/form.html", {
        "form": form, "heading": "Сообщить о проблеме", "offer": offer,
    })


@login_required
@require_http_methods(["GET", "POST"])
def report_edit(request, pk):
    report = get_object_or_404(Report.objects.select_related("offer"), pk=pk, user=request.user)
    form = ReportForm(request.POST if request.method == "POST" else None, instance=report)
    if request.method == "POST" and form.is_valid():
        report = form.save(commit=False)
        report.save(update_fields=["comment"])
        return redirect("report-detail", pk=pk)
    return render(request, "reports/form.html", {
        "form": form, "heading": "Изменить обращение", "offer": report.offer, "report": report,
    })


@login_required
@require_http_methods(["GET", "POST"])
def report_delete(request, pk):
    report = get_object_or_404(Report, pk=pk, user=request.user)
    if request.method == "POST":
        report.delete()
        return redirect("report-list")
    return render(request, "reports/confirm_delete.html", {"report": report})
