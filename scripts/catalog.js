import { offers, stores } from './offers.js';
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
  card.querySelector('.offer-cover').classList.add('cover-' + offer.store);
  card.querySelector('img').src = 'assets/logos/' + store.logo;
  card.querySelector('.offer-store').textContent = store.name;
  card.querySelector('h3').textContent = offer.title;
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

function catalogUrl(store, type = 'all') {
  const query = new URLSearchParams();
  if (store) query.set('store', store);
  if (type !== 'all') query.set('type', type);
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
  const selectedStore = query.get('store');
  if (Object.hasOwn(stores, selectedStore)) storeFilter.value = selectedStore;

  const links = [...storeNav.querySelectorAll('[data-store]')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const selectedType = query.get('type');
  let type = filters.some((filter) => filter.dataset.filter === selectedType) ? selectedType : 'all';

  function applyFilters() {
    const store = storeFilter.value;

    for (const link of links) {
      link.href = catalogUrl(link.dataset.store, type);
      if (link.dataset.store === store) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    for (const filter of filters) filter.setAttribute('aria-pressed', filter.dataset.filter === type);

    showOffers(offers.filter((offer) =>
      (type === 'all' || offer.type === type) &&
      (!store || offer.store === store)
    ));
  }

  function updateFilters() {
    history.replaceState(null, '', catalogUrl(storeFilter.value, type));
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
    link.href = catalogUrl(id);
    logo.alt = store.name;
    logo.src = 'assets/logos/' + store.logo;
    link.append(logo);
    storeNav.append(link);
  }

  const featuredOffers = Object.keys(stores).map((id) => offers.find((offer) => offer.store === id));
  showOffers(featuredOffers.filter(Boolean));
}
