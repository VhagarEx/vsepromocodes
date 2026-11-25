from django.contrib import messages
from django.db import IntegrityError, transaction
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods

from .forms import RegistrationForm


@require_http_methods(["GET", "POST"])
def register(request):
    if request.user.is_authenticated:
        return redirect("catalog")

    form = RegistrationForm(request.POST if request.method == "POST" else None)
    if request.method == "POST" and form.is_valid():
        try:
            with transaction.atomic():
                form.save()
        except IntegrityError:
            form.add_error(None, "Логин или email уже занят.")
        else:
            messages.success(request, "Аккаунт создан. Теперь можно войти.")
            return redirect("login")

    return render(request, "register.html", {"form": form})
