import { describe, expect, it } from 'vitest';
import type { Product } from '@/types';
import { getCartProductMap, getCartTotal } from './cart';

const products: Product[] = [
  { id: 1, image_url: '', title: 'Pro 14', description: '', price: 1000 },
  { id: 2, image_url: '', title: 'Studio 27', description: '', price: 2500 },
];

describe('cart utilities', () => {
  it('creates a quantity lookup map', () => {
    expect(getCartProductMap([{ id: 1, quantity: 2 }])).toEqual(new Map([[1, 2]]));
  });

  it('calculates total using a price map', () => {
    expect(getCartTotal([{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }], products)).toBe(4500);
  });

  it('ignores unavailable products', () => {
    expect(getCartTotal([{ id: 999, quantity: 2 }], products)).toBe(0);
  });
});