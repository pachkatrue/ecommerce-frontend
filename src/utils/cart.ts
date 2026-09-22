import type { CartItem, Product } from '@/types';

export const getCartProductMap = (cart: CartItem[]) =>
  new Map(cart.map((item) => [item.id, item.quantity]));

export const getCartTotal = (cart: CartItem[], products: Product[]) => {
  const prices = new Map(products.map((product) => [product.id, product.price]));
  return cart.reduce((total, item) => total + (prices.get(item.id) ?? 0) * item.quantity, 0);
};