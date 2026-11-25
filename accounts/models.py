from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    full_name = models.CharField("ФИО", max_length=160, blank=True)
    email = models.EmailField("Email", unique=True)

    REQUIRED_FIELDS = ["email"]
