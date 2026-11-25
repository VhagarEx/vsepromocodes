import { offerTitle, offers, stores, storePageUrl } from './offers.js';
import { formatExpiry, openOffer } from './offer-dialog.js';

const query = new URLSearchParams(location.search);
const storeId = query.get('store');
const store = Object.hasOwn(stores, storeId) ? stores[storeId] : null;
const layout = document.querySelector('#store-layout');
const missing = document.querySelector('#store-missing');

if (!store) {
  missing.hidden = false;
} else {
  const storeOffers = offers.filter((offer) => offer.store === storeId);
  const heading = 'Промокоды и акции ' + store.couponsName;
  document.title = heading + ' — Все промокоды';
  document.querySelector('#store-heading').textContent = heading;

  const logo = document.querySelector('#store-logo');
  logo.src = '/static/assets/logos/' + store.logo;
  logo.alt = store.name;

  const filters = [...layout.querySelectorAll('[data-store-type]')];
  const list = document.querySelector('#store-offers');
  const count = document.querySelector('#store-count');
  const empty = document.querySelector('#store-empty');
  const template = document.querySelector('#store-offer-template');

  function offersOfType(type) {
    return type === 'all' ? storeOffers : storeOffers.filter((offer) => offer.type === type);
  }

  function makeOffer(offer) {
    const row = template.content.firstElementChild.cloneNode(true);
    const headline = row.querySelector('h2');
    const hasCode = offer.type === 'code';
    row.querySelector('.store-offer-discount').textContent = offer.discount;
    row.querySelector('.store-offer-type').textContent = hasCode ? 'Промокод' : 'Акция';
    row.querySelector('.offer-date').textContent = formatExpiry(offer.expires);
    row.querySelector('.store-offer-terms').textContent = offer.terms;
    const detail = row.querySelector('.store-offer-detail');
    detail.search = new URLSearchParams({ id: offer.id });

    if (hasCode) {
      headline.textContent = offer.title;
      const button = row.querySelector('button');
      button.hidden = false;
      button.addEventListener('click', () => openOffer(offer));
    } else {
      const link = document.createElement('a');
      link.href = offer.url;
      link.textContent = offer.title;
      link.setAttribute('aria-label', offerTitle(offer));
      headline.append(link);
    }

    return row;
  }

  function showType(type) {
    const items = offersOfType(type);
    for (const filter of filters) {
      filter.setAttribute('aria-pressed', filter.dataset.storeType === type);
    }

    list.replaceChildren(...items.map(makeOffer));
    count.textContent = 'Найдено предложений: ' + items.length;
    empty.hidden = Boolean(items.length);
  }

  for (const filter of filters) {
    const type = filter.dataset.storeType;
    filter.querySelector('.store-filter-count').textContent = offersOfType(type).length;

    filter.addEventListener('click', () => {
      const url = new URL(storePageUrl(storeId), location.href);
      if (type !== 'all') url.searchParams.set('type', type);
      history.replaceState(null, '', url);
      showType(type);
    });
  }

  const initialType = query.get('type');
  showType(filters.some((filter) => filter.dataset.storeType === initialType) ? initialType : 'all');
  layout.hidden = false;
}
