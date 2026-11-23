import { storePageUrl, stores } from './offers.js';

const storeMenu = document.querySelector('#header-stores');
const menus = [...document.querySelectorAll('.header-menu')];

for (const [id, store] of Object.entries(stores)) {
  const item = document.createElement('li');
  const link = document.createElement('a');
  link.href = storePageUrl(id);
  link.textContent = store.name;
  item.append(link);
  storeMenu.append(item);
}

for (const menu of menus) {
  menu.addEventListener('toggle', () => {
    if (!menu.open) return;
    for (const other of menus) {
      if (other !== menu) other.open = false;
    }
  });
}

document.addEventListener('click', (event) => {
  for (const menu of menus) {
    if (!menu.contains(event.target)) menu.open = false;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || event.defaultPrevented) return;

  const openMenu = menus.find((menu) => menu.open);
  if (!openMenu) return;

  openMenu.open = false;
  openMenu.querySelector('summary').focus();
});
