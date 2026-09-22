import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '@/types';
import { storage } from '@/utils/storage';
import { addCartItem, setCartItemQuantity } from '@/utils/cartState';

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
    updateCart((current) => setCartItemQuantity(current, productId, quantity));
  }, [updateCart]);

  const addToCart = useCallback((productId: number, quantity = 1) => {
    updateCart((current) => addCartItem(current, productId, quantity));
  }, [updateCart]);

  const removeFromCart = useCallback((productId: number) => {
    updateCart((current) => current.filter((item) => item.id !== productId));
  }, [updateCart]);

  const clearCart = useCallback(() => updateCart(() => []), [updateCart]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const getTotalPrice = useCallback((products: Product[]) => {
    const prices = new Map(products.map((product) => [product.id, product.price]));
    return cart.reduce(
      (sum, item) => sum + (prices.get(item.id) ?? 0) * item.quantity,
      0,
    );
  }, [cart]);

  return {
    cart,
    addToCart,
    setQuantity,
    removeFromCart,
    totalItems,
    getTotalPrice,
    clearCart,
  };
};
