from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from .models import User


class RegistrationForm(UserCreationForm):
    full_name = forms.CharField(
        label="ФИО", max_length=160,
        widget=forms.TextInput(attrs={"autocomplete": "name"}),
    )
    email = forms.EmailField(
        label="Email", max_length=254,
        widget=forms.EmailInput(attrs={"autocomplete": "email"}),
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("full_name", "username", "email")
        labels = {"username": "Логин"}
        help_texts = {"username": ""}
        widgets = {"username": forms.TextInput(attrs={"autocomplete": "username"})}

    def clean_email(self):
        email = self.cleaned_data["email"].lower()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("Этот email уже зарегистрирован.")
        return email


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        label="Логин или email", max_length=254,
        widget=forms.TextInput(attrs={"autocomplete": "username", "autofocus": True}),
    )
