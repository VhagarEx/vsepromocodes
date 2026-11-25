from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.test import Client, TestCase

from .models import Offer, Report

User = get_user_model()


class LabThreeTests(TestCase):
    fixtures = ["demo"]

    @classmethod
    def setUpTestData(cls):
        cls.offer = Offer.objects.get(pk=1)
        cls.owner = User.objects.create_user("owner", "owner@example.test", "OwnerPass438!")
        cls.other = User.objects.create_user("other", "other@example.test", "OtherPass901!")
        cls.staff = User.objects.create_user("staff", "staff@example.test", "StaffPass099!", is_staff=True)
        cls.staff.user_permissions.add(*Permission.objects.filter(
            content_type__app_label="promos", content_type__model="report",
            codename__in=["view_report", "change_report"],
        ))
        cls.report = Report.objects.create(user=cls.owner, offer=cls.offer, comment="Код не работает.")
        cls.other_report = Report.objects.create(user=cls.other, offer=cls.offer, comment="Условия изменились.")

    def test_registration_checks_and_hashes_password(self):
        data = {
            "full_name": "Новый Пользователь", "username": "new_user", "email": "NEW@example.test",
            "password1": "GoodPass438!", "password2": "GoodPass438!",
        }
        for change in (
            {"email": "invalid"}, {"full_name": " "},
            {"password1": "123", "password2": "123"}, {"password2": "DifferentPass43!"},
        ):
            self.assertEqual(self.client.post("/register.html", data | change).status_code, 200)
        self.assertFalse(User.objects.filter(username="new_user").exists())

        self.assertRedirects(self.client.post("/register.html", data), "/login.html")
        user = User.objects.get(username="new_user")
        self.assertEqual(user.email, "new@example.test")
        self.assertFalse(user.is_staff)
        self.assertNotEqual(user.password, data["password1"])
        self.assertTrue(user.check_password(data["password1"]))

        self.client.post("/register.html", data | {"username": "duplicate_email"})
        self.client.post("/register.html", data | {"email": "second@example.test"})
        self.assertEqual(User.objects.filter(email__iexact=data["email"]).count(), 1)
        self.assertFalse(User.objects.filter(email="second@example.test").exists())

    def test_sign_in_by_login_or_email_and_post_logout(self):
        self.assertEqual(self.client.get("/reports/").status_code, 302)
        self.client.post("/login.html", {"username": "owner", "password": "wrong"})
        self.assertNotIn("_auth_user_id", self.client.session)

        for identifier in ("owner", "OWNER@example.test"):
            self.assertRedirects(self.client.post("/login.html", {
                "username": identifier, "password": "OwnerPass438!",
            }), "/catalog.html")
            self.assertEqual(self.client.session["_auth_user_id"], str(self.owner.pk))
            self.assertEqual(self.client.get("/logout/").status_code, 405)
            self.assertIn("_auth_user_id", self.client.session)
            self.assertRedirects(self.client.post("/logout/"), "/index.html")
            self.assertNotIn("_auth_user_id", self.client.session)

    def test_user_crud_and_ownership(self):
        self.client.force_login(self.owner)
        listing = self.client.get("/reports/")
        self.assertEqual([r.pk for r in listing.context["reports"]], [self.report.pk])

        foreign = f"/reports/{self.other_report.pk}/"
        for suffix in ("", "edit/", "delete/"):
            self.assertEqual(self.client.get(foreign + suffix).status_code, 404)
        for suffix in ("edit/", "delete/"):
            self.assertEqual(self.client.post(foreign + suffix, {"comment": "Чужая запись"}).status_code, 404)

        create_url = f"/offer/{self.offer.pk}/report/"
        rejected = self.client.post(create_url, {"comment": " "})
        self.assertEqual(rejected.status_code, 200)
        self.assertTrue(rejected.context["form"].errors)
        response = self.client.post(create_url, {
            "comment": "Проверка обращения", "user": self.other.pk, "status": "done",
        })
        report = Report.objects.get(comment="Проверка обращения")
        detail = f"/reports/{report.pk}/"
        self.assertRedirects(response, detail)
        self.assertEqual(report.user, self.owner)
        self.assertEqual(report.status, "new")

        Report.objects.filter(pk=report.pk).update(status="in_progress")
        self.assertRedirects(self.client.post(detail + "edit/", {
            "comment": "Комментарий уточнён", "status": "done",
        }), detail)
        report.refresh_from_db()
        self.assertEqual((report.comment, report.status), ("Комментарий уточнён", "in_progress"))

        self.assertEqual(self.client.get(detail + "delete/").status_code, 200)
        self.assertTrue(Report.objects.filter(pk=report.pk).exists())
        self.assertRedirects(self.client.post(detail + "delete/"), "/reports/")
        self.assertFalse(Report.objects.filter(pk=report.pk).exists())

    def test_admin_permissions_and_status(self):
        self.client.force_login(self.owner)
        admin_change = f"/admin/promos/report/{self.report.pk}/change/"
        for path in ("/manage/", "/manage/new/", "/manage/1/edit/", "/manage/1/delete/"):
            self.assertEqual(self.client.get(path).status_code, 403)
            self.assertEqual(self.client.post(path).status_code, 403)
        self.assertRedirects(self.client.get(admin_change), f"/admin/login/?next={admin_change}")
        self.assertEqual(self.client.post(admin_change, {"status": "done"}).status_code, 302)
        self.report.refresh_from_db()
        self.assertEqual(self.report.status, "new")

        self.client.force_login(self.staff)
        admin_list = self.client.get("/admin/promos/report/")
        self.assertContains(admin_list, self.owner.username)
        self.assertContains(admin_list, self.other.username)
        self.assertEqual(self.client.post(admin_change, {"status": "done", "_save": "1"}).status_code, 302)
        self.report.refresh_from_db()
        self.assertEqual(self.report.status, "done")
        self.assertEqual(self.report.comment, "Код не работает.")
        self.assertEqual(self.client.post("/manage/1/delete/").status_code, 409)

    def test_mutations_require_csrf(self):
        client = Client(enforce_csrf_checks=True)
        self.assertEqual(client.post("/login.html", {"username": "owner", "password": "OwnerPass438!"}).status_code, 403)
        client.force_login(self.owner)
        self.assertEqual(client.post("/logout/").status_code, 403)
        self.assertEqual(client.post(f"/reports/{self.report.pk}/delete/").status_code, 403)
