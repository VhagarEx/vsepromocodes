from django import forms

from .models import Offer, Report


class OfferForm(forms.ModelForm):
    class Meta:
        model = Offer
        fields = ("store", "type", "discount", "title", "terms", "expires", "code", "url")
        widgets = {
            "expires": forms.DateInput(format="%Y-%m-%d", attrs={"type": "date"}),
            "terms": forms.Textarea(attrs={"rows": 4}),
        }
        help_texts = {
            "discount": "Например, «400 ₽» или «До 25%».",
            "title": "Продолжение после скидки, например «на первый заказ».",
            "code": "Заполните для промокода.",
            "url": "Заполните для акции по ссылке.",
        }

class ReportForm(forms.ModelForm):
    class Meta:
        model = Report
        fields = ("comment",)
        widgets = {"comment": forms.Textarea(attrs={"rows": 5})}
        help_texts = {"comment": "Опишите проблему, до 1000 символов."}
