from django.conf import settings
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

class Report(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Новое"
        IN_PROGRESS = "in_progress", "В работе"
        DONE = "done", "Рассмотрено"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reports", verbose_name="Автор"
    )
    offer = models.ForeignKey(
        Offer, on_delete=models.PROTECT, related_name="reports", verbose_name="Предложение"
    )
    comment = models.TextField("Комментарий", max_length=1000)
    status = models.CharField("Статус", max_length=11, choices=Status.choices, default=Status.NEW)
    created_at = models.DateTimeField("Создано", auto_now_add=True)

    class Meta:
        verbose_name = "обращение"
        verbose_name_plural = "Обращения"
        ordering = ["-created_at", "-id"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(status__in=["new", "in_progress", "done"]),
                name="report_known_status",
            )
        ]

    def __str__(self):
        return f"Обращение №{self.pk}"
