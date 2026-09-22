import type { CartItem } from '@/types';

export const normalizeQuantity = (quantity: number) =>
  Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;

export const setCartItemQuantity = (
  cart: CartItem[],
  productId: number,
  quantity: number,
): CartItem[] => {
  const nextQuantity = normalizeQuantity(quantity);

  if (nextQuantity === 0) {
    return cart.filter((item) => item.id !== productId);
  }

  if (!cart.some((item) => item.id === productId)) {
    return [...cart, { id: productId, quantity: nextQuantity }];
  }

  return cart.map((item) =>
    item.id === productId ? { ...item, quantity: nextQuantity } : item,
  );
};

export const addCartItem = (
  cart: CartItem[],
  productId: number,
  quantity = 1,
): CartItem[] => {
  const increment = normalizeQuantity(quantity);

  if (!increment) return cart;

  const existing = cart.find((item) => item.id === productId);

  return existing
    ? cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + increment }
          : item,
      )
    : [...cart, { id: productId, quantity: increment }];
};
