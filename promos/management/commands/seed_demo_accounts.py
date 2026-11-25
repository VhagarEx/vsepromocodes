from secrets import token_urlsafe

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from promos.models import Offer, Report

User = get_user_model()


class Command(BaseCommand):
    help = "Создаёт локальные аккаунты для демонстрации ЛР №3."

    def handle(self, *args, **options):
        if not settings.DEBUG:
            raise CommandError("Демонстрационные аккаунты доступны в локальном режиме.")

        offer = Offer.objects.first()
        if offer is None:
            raise CommandError("Сначала загрузите предложения командой loaddata demo.")

        accounts = (
            ("demo_user", "demo-user@example.test", "Демо Пользователь", False),
            ("demo_other", "demo-other@example.test", "Второй Пользователь", False),
            ("demo_admin", "demo-admin@example.test", "Демо Администратор", True),
        )
        output = []
        with transaction.atomic():
            for username, email, full_name, is_staff in accounts:
                existing = User.objects.filter(username=username).first()
                if existing:
                    if existing.email != email or existing.is_staff != is_staff:
                        raise CommandError(f"Логин {username} уже занят другим аккаунтом.")
                    output.append(f"{username} · {email} · сохранён текущий пароль")
                    continue

                password = token_urlsafe(9)
                user = User.objects.create_user(
                    username=username, email=email, password=password,
                    full_name=full_name, is_staff=is_staff,
                )
                if is_staff:
                    user.user_permissions.add(*Permission.objects.filter(
                        content_type__app_label="promos", content_type__model="report",
                        codename__in=["view_report", "change_report"],
                    ))
                else:
                    Report.objects.create(
                        user=user, offer=offer,
                        comment=f"Демонстрационное обращение от {full_name}.",
                    )

                role = "ADMIN" if is_staff else "USER"
                output.append(f"{role} · {username} · {email} · {password}")

        for line in output:
            self.stdout.write(line)
