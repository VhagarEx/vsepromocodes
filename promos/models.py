from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.db import models


class Store(models.Model):
    slug = models.SlugField("Адрес страницы", unique=True)
    name = models.CharField("Название", max_length=100)
    coupons_name = models.CharField("Название в родительном падеже", max_length=100)
    logo = models.CharField("Файл логотипа", max_length=120)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class Offer(models.Model):
    class Type(models.TextChoices):
        CODE = "code", "Промокод"
        LINK = "link", "Акция"

    store = models.ForeignKey(
        Store, on_delete=models.PROTECT, related_name="offers", verbose_name="Магазин"
    )
    type = models.CharField("Тип", max_length=4, choices=Type.choices)
    discount = models.CharField("Скидка", max_length=32)
    title = models.CharField("Заголовок", max_length=150)
    terms = models.TextField("Условия", max_length=2000)
    expires = models.DateField("Действует до")
    code = models.CharField("Промокод", max_length=64, blank=True)
    url = models.URLField(
        "Ссылка на акцию", blank=True, validators=[URLValidator(schemes=["http", "https"])]
    )

    class Meta:
        ordering = ["id"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    (models.Q(type="code", url="") & ~models.Q(code=""))
                    | (models.Q(type="link", code="") & ~models.Q(url=""))
                ),
                name="offer_code_or_link",
            )
        ]

    @property
    def display_title(self):
        return f"{self.discount} {self.title}"

    def clean(self):
        super().clean()
        errors = {}
        if self.type == self.Type.CODE:
            if not self.code:
                errors["code"] = "Введите код промокода."
            if self.url:
                errors["url"] = "Очистите ссылку для предложения с промокодом."
        if self.type == self.Type.LINK:
            if not self.url:
                errors["url"] = "Укажите ссылку на акцию."
            if self.code:
                errors["code"] = "Очистите код для акции по ссылке."
        if errors:
            raise ValidationError(errors)

    def __str__(self):
        return self.display_title
