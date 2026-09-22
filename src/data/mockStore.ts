import type { OrderRequest, OrderResponse, Product, Review } from '@/types';

const categories = [
  { name: 'Рабочая станция', prefix: 'Work' },
  { name: 'Монитор', prefix: 'View' },
  { name: 'Клавиатура', prefix: 'Key' },
  { name: 'Мышь', prefix: 'Mouse' },
  { name: 'Аудио', prefix: 'Sound' },
  { name: 'Аксессуары', prefix: 'Gear' },
] as const;

const productSeeds = [
  ['Pro 14', 'Мощная компактная рабочая станция для задач разработки и дизайна', 129990],
  ['Air 15', 'Тонкий универсальный ноутбук для работы и поездок', 89990],
  ['Studio 27', '4K IPS-монитор с точной цветопередачей', 64990],
  ['Ultra 32', 'Большой 4K-дисплей для продуктивной работы', 84990],
  ['Mechanical 75', 'Механическая клавиатура с горячей заменой свитчей', 12990],
  ['Silent 104', 'Полноразмерная тихая клавиатура для офиса', 7990],
  ['Precision', 'Эргономичная беспроводная мышь с точным сенсором', 6990],
  ['Track Pro', 'Мышь для длительной работы и точного управления', 9990],
  ['Studio Headset', 'Закрытые наушники с микрофоном для звонков', 14990],
  ['Air Buds', 'Компактные беспроводные наушники с шумоподавлением', 8990],
  ['Dock 8', 'USB-C док-станция с HDMI, Ethernet и картридером', 11990],
  ['Charge 100', 'Универсальное зарядное устройство GaN на 100 Вт', 5990],
];

const products: Product[] = Array.from({ length: 48 }, (_, index) => {
  const seed = productSeeds[index % productSeeds.length];
  const category = categories[index % categories.length];
  const model = `${seed[0]} ${Math.floor(index / productSeeds.length) + 1}`;

  return {
    id: index + 1,
    image_url: `https://placehold.co/600x450/png?text=${encodeURIComponent(model)}`,
    title: model,
    description: `${seed[1]}. Серия ${category.name.toLowerCase()} ${category.prefix}.`,
    price: Number(seed[2]) + (index % 4) * 500,
  };
});

const reviews: Review[] = [
  {
    id: 1,
    text: '<strong>Анна</strong><br>Удобный каталог и понятная корзина. Заказ оформляется без лишних шагов.',
  },
  {
    id: 2,
    text: '<strong>Максим</strong><br>Понравилась быстрая загрузка товаров и сохранение корзины после перезагрузки.',
  },
  {
    id: 3,
    text: '<strong>Ирина</strong><br>Хороший пример современного магазина: поиск товара, количество и оформление заказа находятся в одном сценарии.',
  },
];

const delay = (ms = 180) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mockStore = {
  async getProducts(page = 1, pageSize = 20) {
    await delay();

    const safePage = Math.max(1, page);
    const safePageSize = Math.min(50, Math.max(1, pageSize));
    const start = (safePage - 1) * safePageSize;

    return {
      page: safePage,
      amount: safePageSize,
      total: products.length,
      items: products.slice(start, start + safePageSize),
    };
  },

  async getReviews() {
    await delay(120);
    return reviews;
  },

  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    await delay(250);

    if (!orderData.phone || orderData.cart.length === 0) {
      return { success: 0, error: 'Не удалось оформить заказ' };
    }

    return { success: 1 };
  },
};
