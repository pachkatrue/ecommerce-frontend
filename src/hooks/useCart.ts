import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';
import { storage } from '@/utils/storage';

const normalizeQuantity = (quantity: number) =>
  Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => setCart(storage.getCart()), []);

  const updateCart = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    setCart((current) => {
      const next = updater(current);
      storage.setCart(next);
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    const nextQuantity = normalizeQuantity(quantity);
    updateCart((current) => {
      if (nextQuantity === 0) return current.filter((item) => item.id !== productId);
      if (!current.some((item) => item.id === productId)) {
        return [...current, { id: productId, quantity: nextQuantity }];
      }
      return current.map((item) => item.id === productId ? { ...item, quantity: nextQuantity } : item);
    });
  }, [updateCart]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    const increment = normalizeQuantity(quantity);
    if (!increment) return;
    updateCart((current) => {
      const existing = current.find((item) => item.id === productId);
      return existing
        ? current.map((item) => item.id === productId ? { ...item, quantity: item.quantity + increment } : item)
        : [...current, { id: productId, quantity: increment }];
    });
  }, [updateCart]);

  const removeFromCart = useCallback((productId: number) => {
    updateCart((current) => current.filter((item) => item.id !== productId));
  }, [updateCart]);

  const clearCart = useCallback(() => updateCart(() => []), [updateCart]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const getTotalPrice = useCallback((products: Product[]) => {
    const prices = new Map(products.map((product) => [product.id, product.price]));
    return cart.reduce((sum, item) => sum + (prices.get(item.id) ?? 0) * item.quantity, 0);
  }, [cart]);

  return { cart, addToCart, setQuantity, removeFromCart, totalItems, getTotalPrice, clearCart };
};