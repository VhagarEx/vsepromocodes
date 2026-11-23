import { offers, stores } from './offers.js';
import { openOffer, formatExpiry } from './offer-dialog.js';

const list = document.querySelector('#offers');
const storeNav = document.querySelector('#stores');
const storeFilter = document.querySelector('#store-filter');
const count = document.querySelector('#results-count');
const isCatalog = document.querySelector('[data-directory]').dataset.directory === 'catalog';

const rowTemplate = document.createElement('template');
rowTemplate.innerHTML = `
  <article class="offer-row">
    <img class="offer-logo" alt="">
    <div class="offer-info">
      <h3></h3>
      <p class="offer-date"></p>
    </div>
  </article>
`;

function makeRow(offer) {
  const row = rowTemplate.content.firstElementChild.cloneNode(true);
  const store = stores[offer.store];
  const logo = row.querySelector('img');

  logo.src = 'assets/logos/' + store.logo;
  logo.alt = store.name;
  row.querySelector('h3').textContent = offer.title;
  row.querySelector('.offer-date').textContent = formatExpiry(offer.expires);

  if (offer.type === 'code') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button';
    button.textContent = 'Показать код';
    button.addEventListener('click', () => openOffer(offer));
    row.append(button);
  } else {
    const link = document.createElement('a');
    link.className = 'button button-outline';
    link.href = offer.url;
    link.textContent = 'Перейти к акции';
    row.append(link);
  }

  return row;
}

function showOffers(items) {
  list.replaceChildren(...items.map(makeRow));
  if (count) {
    count.textContent = items.length
      ? 'Найдено предложений: ' + items.length
      : 'По этим фильтрам ничего не найдено.';
  }
}

function catalogUrl(store) {
  return store ? 'catalog.html?store=' + encodeURIComponent(store) : 'catalog.html';
}

function makeStoreLink(id, name) {
  const link = document.createElement('a');
  link.className = 'store-link';
  link.href = catalogUrl(id);
  link.textContent = name;
  link.dataset.store = id;
  return link;
}

if (isCatalog) storeNav.append(makeStoreLink('', 'Все магазины'));

for (const [id, store] of Object.entries(stores)) {
  storeNav.append(makeStoreLink(id, store.name));
  storeFilter.add(new Option(store.name, id));
}

if (isCatalog) {
  const selectedStore = new URLSearchParams(location.search).get('store');
  if (Object.hasOwn(stores, selectedStore)) storeFilter.value = selectedStore;

  const links = [...storeNav.querySelectorAll('[data-store]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  let type = 'all';

  function applyFilters() {
    const store = storeFilter.value;
    for (const link of links) {
      if (link.dataset.store === store) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    showOffers(offers.filter((offer) =>
      (type === 'all' || offer.type === type) &&
      (!store || offer.store === store)
    ));
  }

  function selectStore(id) {
    storeFilter.value = id;
    history.replaceState(null, '', catalogUrl(id));
    applyFilters();
  }

  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectStore(link.dataset.store);
    });
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => {
      type = filter.dataset.filter;
      for (const button of filters) button.setAttribute('aria-pressed', button === filter);
      applyFilters();
    });
  }

  storeFilter.addEventListener('change', () => selectStore(storeFilter.value));
  applyFilters();
} else {
  storeFilter.addEventListener('change', () => {
    if (storeFilter.value) location.assign(catalogUrl(storeFilter.value));
  });

  const featuredOffers = Object.keys(stores).map((id) => offers.find((offer) => offer.store === id));
  showOffers(featuredOffers.filter(Boolean));
}
