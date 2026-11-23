import { offerTitle, stores } from './offers.js';

const dialog = document.querySelector('#offer-dialog');
const logo = dialog.querySelector('#offer-logo');
const details = dialog.querySelector('#offer-details');
const title = dialog.querySelector('#offer-heading');
const terms = dialog.querySelector('#offer-terms');
const date = dialog.querySelector('#offer-date');
const code = dialog.querySelector('#offer-code');
const copyButton = dialog.querySelector('#copy-code');
const status = dialog.querySelector('#copy-status');

const dateFormat = new Intl.DateTimeFormat('ru', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatExpiry(value) {
  return 'До ' + dateFormat.format(new Date(value));
}

export function openOffer(offer) {
  const store = stores[offer.store];
  logo.src = 'assets/logos/' + store.logo;
  logo.alt = store.name;
  details.open = false;
  title.textContent = offerTitle(offer);
  terms.textContent = offer.terms;
  date.textContent = formatExpiry(offer.expires);
  code.textContent = offer.code;
  status.textContent = '';
  dialog.showModal();
}

copyButton.addEventListener('click', async () => {
  const value = code.textContent;

  try {
    await navigator.clipboard.writeText(value);
    if (dialog.open && code.textContent === value) status.textContent = 'Код скопирован.';
  } catch {
    if (!dialog.open || code.textContent !== value) return;

    // Если браузер запретил копирование, выделяем код для ручного копирования.
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Скопируйте выделенный код вручную.';
  }
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
