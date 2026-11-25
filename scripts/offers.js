export const stores = JSON.parse(document.querySelector('#stores-data').textContent);
const offersData = document.querySelector('#offers-data');
export const offers = offersData ? JSON.parse(offersData.textContent) : [];

export function offerTitle(offer) {
  return offer.discount + ' ' + offer.title;
}

export function storePageUrl(storeId) {
  return '/store.html?store=' + encodeURIComponent(storeId);
}
