'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { CartItem, Product } from '@/types';
import { api } from '@/utils/api';
import { storage } from '@/utils/storage';
import { maskPhone, isPhoneValid, formatPhone } from '@/utils/phone';
import './order-form.css';

interface OrderFormProps {
  cart: CartItem[];
  products: Product[];
  onOrderSuccess: () => void;
}

export const OrderForm = ({ cart, products, onOrderSuccess }: OrderFormProps) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setPhone(storage.getPhone()), []);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (productById.get(item.id)?.price ?? 0) * item.quantity, 0),
    [cart, productById],
  );

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = maskPhone(event.target.value);
    setPhone(value);
    storage.setPhone(formatPhone(value));
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (!isPhoneValid(phone)) {
      setError('Введите корректный номер телефона');
      return;
    }
    if (!cart.length) {
      setError('Корзина пуста');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.createOrder({ phone: formatPhone(phone), cart });
      if (response.success) onOrderSuccess();
      else setError(response.error || 'Не удалось оформить заказ');
    } catch {
      setError('Не удалось оформить заказ. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="order-form" aria-labelledby="order-title">
      <h2 id="order-title" className="block-title">Ваш заказ</h2>
      {!cart.length ? (
        <p className="empty-cart">Добавьте товары, чтобы оформить заказ.</p>
      ) : (
        <div className="cart-items" aria-label="Товары в корзине">
          {cart.map((item) => {
            const product = productById.get(item.id);
            const price = product?.price ?? 0;
            return (
              <div key={item.id} className="cart-item">
                <span className="name">{product?.title ?? ('Товар ' + item.id)}</span>
                <span>{item.quantity} × {price.toLocaleString('ru-RU')} ₽</span>
              </div>
            );
          })}
          <div className="cart-total"><span>Итого</span><strong>{total.toLocaleString('ru-RU')} ₽</strong></div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-row">
          <div className="phone-field">
            <label htmlFor="phone">Телефон</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'order-error' : undefined}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" disabled={loading || !cart.length} className="submit-btn">
            {loading ? 'Оформляем…' : 'Заказать'}
          </button>
        </div>
        {error && <p id="order-error" className="error-message" role="alert">{error}</p>}
      </form>
    </section>
  );
};
