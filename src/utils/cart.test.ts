import assert from 'node:assert/strict';
import test from 'node:test';
import type { Product } from './cart.ts';
import { getCartProductMap, getCartTotal } from './cart.ts';

const products: Product[] = [
  { id: 1, image_url: '', title: 'Pro 14', description: '', price: 1000 },
  { id: 2, image_url: '', title: 'Studio 27', description: '', price: 2500 },
];

test('cart utilities: creates a quantity lookup map', () => {
  assert.deepEqual(getCartProductMap([{ id: 1, quantity: 2 }]), new Map([[1, 2]]));
});

test('cart utilities: calculates total using a price map', () => {
  assert.equal(
    getCartTotal([{ id: 1, quantity: 2 }, { id: 2, quantity: 1 }], products),
    4500,
  );
});

test('cart utilities: ignores unavailable products', () => {
  assert.equal(getCartTotal([{ id: 999, quantity: 2 }], products), 0);
});
