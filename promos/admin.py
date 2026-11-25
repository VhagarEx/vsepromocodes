from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "offer", "status", "created_at")
    list_filter = ("status",)
    list_select_related = ("user", "offer")
    fields = ("user", "offer", "comment", "created_at", "status")
    readonly_fields = ("user", "offer", "comment", "created_at")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        obj.save(update_fields=["status"])
