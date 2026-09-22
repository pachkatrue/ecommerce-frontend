'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import './product-card.css';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (quantity: number) => void;
  onSetQuantity: (quantity: number) => void;
}

const normalizeInputQuantity = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
};

export const ProductCard = ({
  product,
  cartQuantity,
  onAddToCart,
  onSetQuantity,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(String(Math.max(1, cartQuantity)));
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setQuantity(String(Math.max(1, cartQuantity)));
  }, [cartQuantity]);

  const commitQuantity = (value: string) => {
    const next = normalizeInputQuantity(value);
    setQuantity(String(Math.max(1, next)));
    onSetQuantity(next);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (!/^\d*$/.test(value)) return;

    setQuantity(value);

    if (value !== '') {
      onSetQuantity(normalizeInputQuantity(value));
    }
  };

  const handleInputBlur = () => {
    if (quantity === '') {
      commitQuantity('1');
    }
  };

  return (
    <article className="product-card">
      <div className="image-wrapper">
        {!imageError ? (
          <Image
            src={product.image_url}
            alt={product.title}
            width={400}
            height={300}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="image-fallback"
            role="img"
            aria-label={'Изображение недоступно: ' + product.title}
          >
            <span aria-hidden="true">▧</span>
          </div>
        )}
      </div>

      <div className="content">
        <h2 className="title">{product.title}</h2>
        <p className="description">{product.description}</p>
        <p className="price">
          <span className="sr-only">Цена: </span>
          {product.price.toLocaleString('ru-RU')} ₽
        </p>

        {cartQuantity === 0 ? (
          <button
            type="button"
            onClick={() => onAddToCart(1)}
            className="buy-button"
            aria-label={'Добавить в корзину: ' + product.title}
          >
            Купить
          </button>
        ) : (
          <div className="quantity-controls" aria-label="Количество товара">
            <button
              type="button"
              onClick={() => commitQuantity(String(normalizeInputQuantity(quantity) - 1))}
              className="quantity-button"
              aria-label={'Уменьшить количество: ' + product.title}
            >
              −
            </button>

            <label className="sr-only" htmlFor={'quantity-' + product.id}>
              Количество: {product.title}
            </label>

            <input
              id={'quantity-' + product.id}
              type="number"
              value={quantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="quantity-input"
              min="0"
              step="1"
              inputMode="numeric"
            />

            <button
              type="button"
              onClick={() => commitQuantity(String(normalizeInputQuantity(quantity) + 1))}
              className="quantity-button"
              aria-label={'Увеличить количество: ' + product.title}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
