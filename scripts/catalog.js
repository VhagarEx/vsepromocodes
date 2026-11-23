import { offerTitle, offers, storePageUrl, stores } from './offers.js';
import { openOffer, formatExpiry } from './offer-dialog.js';

const list = document.querySelector('#offers');
const storeNav = document.querySelector('#stores');
const storeFilter = document.querySelector('#store-filter');
const count = document.querySelector('#results-count');

const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
  <div class="offer-cover"><img class="offer-logo" alt=""></div>
  <div class="offer-info">
    <p class="offer-store"></p>
    <h3></h3>
    <p class="offer-date"></p>
  </div>
`;

function makeCard(offer) {
  const hasCode = offer.type === 'code';
  const card = document.createElement(hasCode ? 'article' : 'a');
  card.className = 'offer-card';
  card.append(cardTemplate.content.cloneNode(true));

  const store = stores[offer.store];
  card.querySelector('img').src = 'assets/logos/' + store.logo;
  card.querySelector('.offer-store').textContent = store.name;
  card.querySelector('h3').textContent = offerTitle(offer);
  card.querySelector('.offer-date').textContent = formatExpiry(offer.expires);

  if (hasCode) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button offer-code-button';
    button.textContent = 'Показать код';
    button.addEventListener('click', () => openOffer(offer));
    card.querySelector('.offer-info').append(button);
  } else {
    card.classList.add('offer-card-link');
    card.href = offer.url;
  }

  return card;
}

function showOffers(items) {
  list.replaceChildren(...items.map(makeCard));
  if (count) {
    count.textContent = items.length
      ? 'Найдено предложений: ' + items.length
      : 'По этим фильтрам ничего не найдено.';
  }
}

function normalizeSearch(value) {
  return value.normalize('NFC').toLowerCase().replaceAll('ё', 'е');
}

function catalogUrl(store, type = 'all', search = '') {
  const query = new URLSearchParams();
  if (store) query.set('store', store);
  if (type !== 'all') query.set('type', type);
  if (search) query.set('q', search);
  return query.size ? 'catalog.html?' + query : 'catalog.html';
}

function makeStoreLink(id, name) {
  const link = document.createElement('a');
  link.className = 'store-link';
  link.href = catalogUrl(id);
  link.textContent = name;
  link.dataset.store = id;
  return link;
}

if (storeFilter) {
  storeNav.append(makeStoreLink('', 'Все магазины'));
  for (const [id, store] of Object.entries(stores)) {
    storeNav.append(makeStoreLink(id, store.name));
    storeFilter.add(new Option(store.name, id));
  }

  const query = new URLSearchParams(location.search);
  const search = (query.get('q') ?? '').trim().slice(0, 100);
  const searchWords = search ? normalizeSearch(search).split(/\s+/) : [];
  const searchInput = document.querySelector('#site-search');
  const searchContext = document.querySelector('#search-context');
  const searchQuery = document.querySelector('#search-query');
  const clearSearch = document.querySelector('#clear-search');
  searchInput.value = search;
  searchContext.hidden = !search;
  searchQuery.textContent = search;
  const selectedStore = query.get('store');
  if (Object.hasOwn(stores, selectedStore)) storeFilter.value = selectedStore;

  const links = [...storeNav.querySelectorAll('[data-store]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const selectedType = query.get('type');
  let type = filters.some((filter) => filter.dataset.filter === selectedType) ? selectedType : 'all';

  function applyFilters() {
    const store = storeFilter.value;

    for (const link of links) {
      link.href = catalogUrl(link.dataset.store, type, search);
      if (link.dataset.store === store) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    for (const filter of filters) filter.setAttribute('aria-pressed', filter.dataset.filter === type);

    clearSearch.href = catalogUrl(store, type);

    showOffers(offers.filter((offer) => {
      if (type !== 'all' && offer.type !== type) return false;
      if (store && offer.store !== store) return false;

      const searchable = normalizeSearch([stores[offer.store].name, offerTitle(offer), offer.code].join(' '));
      return searchWords.every((word) => searchable.includes(word));
    }));
  }

  function updateFilters() {
    history.replaceState(null, '', catalogUrl(storeFilter.value, type, search));
    applyFilters();
  }

  for (const link of links) {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      storeFilter.value = link.dataset.store;
      updateFilters();
    });
  }

  for (const filter of filters) {
    filter.addEventListener('click', () => {
      type = filter.dataset.filter;
      updateFilters();
    });
  }

  storeFilter.addEventListener('change', updateFilters);
  applyFilters();
} else {
  for (const [id, store] of Object.entries(stores)) {
    const link = document.createElement('a');
    const logo = document.createElement('img');
    link.className = 'home-store';
    link.href = storePageUrl(id);
    logo.alt = store.name;
    logo.src = 'assets/logos/' + store.logo;
    link.append(logo);
    storeNav.append(link);
  }

  const featuredOffers = Object.keys(stores).map((id) => offers.find((offer) => offer.store === id));
  showOffers(featuredOffers.filter(Boolean));
}
