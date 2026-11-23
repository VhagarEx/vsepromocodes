export const stores = {
  pyaterochka: { name: 'Пятёрочка', logo: 'pyaterochka.webp' },
  samokat: { name: 'Самокат', logo: 'samokat.png' },
  eda: { name: 'Яндекс Еда', logo: 'yandex-eda.png' },
  lavka: { name: 'Яндекс Лавка', logo: 'yandex-lavka.png' },
};

export const offers = [
  {
    store: 'pyaterochka',
    type: 'code',
    title: '400 ₽ на первый заказ',
    expires: '2026-12-31',
    code: 'START400',
    terms: 'Для первого заказа с доставкой от 1 200 ₽. Введите код при оформлении.',
  },
  {
    store: 'samokat',
    type: 'link',
    title: 'До 25% на продукты недели',
    expires: '2026-12-20',
    url: 'https://samokat.ru/',
  },
  {
    store: 'eda',
    type: 'code',
    title: '500 ₽ на первый заказ из ресторана',
    expires: '2026-12-31',
    code: 'EDA500',
    terms: 'Для первого заказа из ресторана на сумму от 1 500 ₽ без учёта доставки.',
  },
  {
    store: 'lavka',
    type: 'link',
    title: 'До 30% на подборку товаров',
    expires: '2026-12-27',
    url: 'https://lavka.yandex.ru/',
  },
  {
    store: 'pyaterochka',
    type: 'link',
    title: 'До 20% на товары из подборки',
    expires: '2026-12-27',
    url: 'https://5ka.ru/',
  },
  {
    store: 'samokat',
    type: 'code',
    title: '300 ₽ на доставку продуктов',
    expires: '2026-12-31',
    code: 'SAMOKAT300',
    terms: 'Для первого заказа на сумму от 1 000 ₽. Укажите код в корзине.',
  },
  {
    store: 'eda',
    type: 'link',
    title: 'До 35% в ресторанах-партнёрах',
    expires: '2026-12-27',
    url: 'https://eda.yandex.ru/',
  },
  {
    store: 'lavka',
    type: 'code',
    title: '350 ₽ на первый заказ в Лавке',
    expires: '2026-12-31',
    code: 'LAVKA350',
    terms: 'Для первого заказа от 1 100 ₽. Введите код перед оплатой.',
  },
];
