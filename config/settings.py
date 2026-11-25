import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY") or (
    "django-insecure-vsepromocodes-local-development" if DEBUG else ""
)
ALLOWED_HOSTS = ["127.0.0.1", "localhost", "[::1]"]

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "accounts",
    "promos",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
]
ROOT_URLCONF = "config.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "promos.context.catalog_stores",
    ]},
}]

DATABASES = {"default": {
    "ENGINE": "django.db.backends.sqlite3",
    "NAME": BASE_DIR / "db.sqlite3",
}}
AUTH_USER_MODEL = "accounts.User"
LANGUAGE_CODE = "ru"
TIME_ZONE = "Europe/Astrakhan"
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    (folder, BASE_DIR / folder) for folder in ("assets", "scripts", "styles")
]

if DEBUG and os.environ.get("SHOW_SQL") == "1":
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": False,
        "handlers": {"console": {"class": "logging.StreamHandler"}},
        "loggers": {
            "django.db.backends": {
                "handlers": ["console"],
                "level": "DEBUG",
                "propagate": False,
            },
        },
    }
