const registration = document.querySelector('#register-form');
const login = document.querySelector('#login-form');

function showStatus(form, message) {
  const status = form.querySelector('.form-status');
  status.textContent = message;
  status.hidden = !message;
}

if (registration) {
  const fields = [...registration.querySelectorAll('input')];
  const password = registration.elements.namedItem('password');
  const repeat = registration.elements.namedItem('password-repeat');
  let submitted = false;

  function validate(input) {
    let message = '';
    if (!input.value.trim()) {
      message = 'Заполните это поле.';
    } else if (input.type === 'email' && input.validity.typeMismatch) {
      message = 'Введите email в формате name@example.ru.';
    } else if (input === password && input.value.length < 8) {
      message = 'В пароле должно быть не менее 8 символов.';
    } else if (input === repeat && input.value !== password.value) {
      message = 'Пароли не совпадают.';
    }

    const error = document.getElementById(input.id + '-error');
    error.textContent = message;
    error.hidden = !message;
    input.setAttribute('aria-invalid', Boolean(message));
    return !message;
  }

  registration.addEventListener('submit', (event) => {
    event.preventDefault();
    submitted = true;
    showStatus(registration, '');

    const invalid = fields.filter((input) => !validate(input));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    showStatus(registration, 'Данные прошли проверку.');
  });

  registration.addEventListener('input', (event) => {
    if (!submitted || !fields.includes(event.target)) return;
    showStatus(registration, '');
    validate(event.target);
    if (event.target === password) validate(repeat);
  });

  registration.querySelector('button[type="submit"]').disabled = false;
}

if (login) {
  login.addEventListener('submit', (event) => {
    event.preventDefault();
    showStatus(login, 'Вход будет доступен после подключения сервера.');
  });

  login.querySelector('button[type="submit"]').disabled = false;
}
