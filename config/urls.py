from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path

from accounts.forms import LoginForm
from accounts.views import register

from promos import report_views, views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home),
    path("index.html", views.home, name="home"),
    path("catalog.html", views.catalog, name="catalog"),
    path("store.html", views.store_page, name="store-page"),
    path("register.html", register, name="register"),
    path("login.html", auth_views.LoginView.as_view(
        template_name="login.html", authentication_form=LoginForm, redirect_authenticated_user=True,
    ), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("offer/", views.offer_detail, name="offer-detail"),
    path("manage/", views.offer_management, name="offer-management"),
    path("manage/new/", views.offer_create, name="offer-create"),
    path("manage/<int:pk>/edit/", views.offer_edit, name="offer-edit"),
    path("manage/<int:pk>/delete/", views.offer_delete, name="offer-delete"),
    path("reports/", report_views.report_list, name="report-list"),
    path("reports/<int:pk>/", report_views.report_detail, name="report-detail"),
    path("reports/<int:pk>/edit/", report_views.report_edit, name="report-edit"),
    path("reports/<int:pk>/delete/", report_views.report_delete, name="report-delete"),
    path("offer/<int:offer_id>/report/", report_views.report_create, name="report-create"),
]
