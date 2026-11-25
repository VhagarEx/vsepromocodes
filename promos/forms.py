from django import forms

from .models import Offer


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
