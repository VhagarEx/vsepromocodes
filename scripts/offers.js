export const stores = {
  pyaterochka: { name: 'Пятёрочка', couponsName: 'Пятёрочки', logo: 'pyaterochka.webp' },
  samokat: { name: 'Самокат', couponsName: 'Самоката', logo: 'samokat.png' },
  eda: { name: 'Яндекс Еда', couponsName: 'Яндекс Еды', logo: 'yandex-eda.png' },
  lavka: { name: 'Яндекс Лавка', couponsName: 'Яндекс Лавки', logo: 'yandex-lavka.png' },
};

export const offers = [
  {
    store: 'pyaterochka',
    type: 'code',
    discount: '400 ₽',
    title: 'на первый заказ',
    expires: '2026-12-31',
    code: 'START400',
    terms: 'Для первого заказа с доставкой от 1 200 ₽. Введите код при оформлении.',
  },
  {
    store: 'samokat',
    type: 'link',
    discount: 'До 25%',
    title: 'на продукты недели',
    expires: '2026-12-20',
    url: 'https://samokat.ru/',
    terms: 'Скидка применяется к товарам из подборки недели. Ассортимент зависит от адреса доставки.',
  },
  {
    store: 'eda',
    type: 'code',
    discount: '500 ₽',
    title: 'на первый заказ из ресторана',
    expires: '2026-12-31',
    code: 'EDA500',
    terms: 'Для первого заказа из ресторана на сумму от 1 500 ₽ без учёта доставки.',
  },
  {
    store: 'lavka',
    type: 'link',
    discount: 'До 30%',
    title: 'на подборку товаров',
    expires: '2026-12-27',
    url: 'https://lavka.yandex.ru/',
    terms: 'Скидка действует на отмеченные товары из подборки. Доступность товаров зависит от адреса.',
  },
  {
    store: 'pyaterochka',
    type: 'link',
    discount: 'До 20%',
    title: 'на товары из подборки',
    expires: '2026-12-27',
    url: 'https://5ka.ru/',
    terms: 'Скидка действует на товары из подборки при заказе доставки. Итоговая цена видна в корзине.',
  },
  {
    store: 'samokat',
    type: 'code',
    discount: '300 ₽',
    title: 'на доставку продуктов',
    expires: '2026-12-31',
    code: 'SAMOKAT300',
    terms: 'Для первого заказа на сумму от 1 000 ₽. Укажите код в корзине.',
  },
  {
    store: 'eda',
    type: 'link',
    discount: 'До 35%',
    title: 'в ресторанах-партнёрах',
    expires: '2026-12-27',
    url: 'https://eda.yandex.ru/',
    terms: 'В акции участвуют отдельные рестораны и блюда. Список зависит от города и адреса доставки.',
  },
  {
    store: 'lavka',
    type: 'code',
    discount: '350 ₽',
    title: 'на первый заказ в Лавке',
    expires: '2026-12-31',
    code: 'LAVKA350',
    terms: 'Для первого заказа от 1 100 ₽. Введите код перед оплатой.',
  },
];

export function offerTitle(offer) {
  return offer.discount + ' ' + offer.title;
}

export function storePageUrl(storeId) {
  return 'store.html?store=' + encodeURIComponent(storeId);
}
