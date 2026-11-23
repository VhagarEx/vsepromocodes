import { offers, stores } from './offers.js';
import { openOffer, formatExpiry } from './offer-dialog.js';

const grid = document.querySelector('#offers');
const storeGrid = document.querySelector('#stores');
const storeFilter = document.querySelector('#store-filter');
const count = document.querySelector('#results-count');

const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
  <article class="offer-card">
    <div class="offer-header">
      <img class="offer-logo" alt="">
      <p class="offer-badge"></p>
    </div>
    <p class="offer-discount"></p>
    <h3></h3>
    <p class="offer-date"></p>
  </article>
`;

function makeCard(offer) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const store = stores[offer.store];
  const logo = card.querySelector('img');
  const badge = card.querySelector('.offer-badge');

  logo.src = 'assets/logos/' + store.logo;
  logo.alt = store.name;
  card.querySelector('.offer-discount').textContent = offer.discount;
  card.querySelector('h3').textContent = offer.title;
  card.querySelector('.offer-date').textContent = formatExpiry(offer.expires);

  if (offer.type === 'code') {
    badge.textContent = 'Промокод';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button';
    button.textContent = 'Показать код';
    button.addEventListener('click', () => openOffer(offer));
    card.append(button);
  } else {
    badge.textContent = 'Акция';
    badge.classList.add('offer-badge-link');
    const link = document.createElement('a');
    link.className = 'button button-outline';
    link.href = offer.url;
    link.textContent = 'Перейти к акции';
    card.append(link);
  }

  return card;
}

function showOffers(items) {
  grid.replaceChildren(...items.map(makeCard));
  if (count) {
    count.textContent = items.length
      ? 'Найдено предложений: ' + items.length
      : 'По этим фильтрам ничего не найдено.';
  }
}

if (storeGrid) {
  for (const [id, store] of Object.entries(stores)) {
    const link = document.createElement('a');
    const logo = document.createElement('img');
    link.className = 'store-card';
    link.href = 'catalog.html?store=' + id;
    logo.className = 'store-logo';
    logo.src = 'assets/logos/' + store.logo;
    logo.alt = store.name;
    link.append(logo);
    storeGrid.append(link);
  }
  showOffers(offers.slice(0, 3));
}

if (storeFilter) {
  for (const [id, store] of Object.entries(stores)) {
    storeFilter.add(new Option(store.name, id));
  }

  const selectedStore = new URLSearchParams(location.search).get('store');
  if (Object.hasOwn(stores, selectedStore)) storeFilter.value = selectedStore;

  const filters = [...document.querySelectorAll('[data-filter]')];
  let type = 'all';

  function applyFilters() {
    showOffers(offers.filter((offer) =>
      (type === 'all' || offer.type === type) &&
      (!storeFilter.value || offer.store === storeFilter.value)
    ));
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => {
      type = filter.dataset.filter;
      for (const button of filters) button.setAttribute('aria-pressed', button === filter);
      applyFilters();
    });
  }

  storeFilter.addEventListener('change', applyFilters);
  applyFilters();
}
