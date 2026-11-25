from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class UsernameOrEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None

        user = User.objects.filter(username=username).first()
        if user is None and "@" in username:
            try:
                user = User.objects.get(email__iexact=username)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                pass

        if user is None:
            User().set_password(password)
            return None
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
