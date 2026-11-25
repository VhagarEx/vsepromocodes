from django.urls import path

from promos import views

urlpatterns = [
    path("", views.home),
    path("index.html", views.home, name="home"),
    path("catalog.html", views.catalog, name="catalog"),
    path("store.html", views.store_page, name="store-page"),
    path("register.html", views.register, name="register"),
    path("login.html", views.login, name="login"),
    path("offer/", views.offer_detail, name="offer-detail"),
    path("manage/", views.offer_management, name="offer-management"),
    path("manage/new/", views.offer_create, name="offer-create"),
    path("manage/<int:pk>/edit/", views.offer_edit, name="offer-edit"),
    path("manage/<int:pk>/delete/", views.offer_delete, name="offer-delete"),
]
