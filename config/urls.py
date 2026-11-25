from django.urls import path

from promos import views

urlpatterns = [
    path("", views.home),
    path("index.html", views.home, name="home"),
    path("catalog.html", views.catalog, name="catalog"),
    path("store.html", views.store_page, name="store-page"),
    path("register.html", views.register, name="register"),
    path("login.html", views.login, name="login"),
]
