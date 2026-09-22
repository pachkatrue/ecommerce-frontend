import assert from 'node:assert/strict';
import test from 'node:test';
import type { CartItem } from '../types/index.ts';
import {
  addCartItem,
  normalizeQuantity,
  setCartItemQuantity,
} from './cartState.ts';

const cart: CartItem[] = [
  { id: 1, quantity: 2 },
  { id: 2, quantity: 1 },
];

test('cart state: normalizes invalid quantities', () => {
  assert.equal(normalizeQuantity(2.8), 2);
  assert.equal(normalizeQuantity(-1), 0);
  assert.equal(normalizeQuantity(Number.NaN), 0);
});

test('cart state: adds a new product', () => {
  assert.deepEqual(addCartItem(cart, 3, 2), [
    ...cart,
    { id: 3, quantity: 2 },
  ]);
});

test('cart state: increments an existing product', () => {
  assert.deepEqual(addCartItem(cart, 1, 3), [
    { id: 1, quantity: 5 },
    { id: 2, quantity: 1 },
  ]);
});

test('cart state: removes a product when quantity becomes zero', () => {
  assert.deepEqual(setCartItemQuantity(cart, 1, 0), [
    { id: 2, quantity: 1 },
  ]);
});

test('cart state: ignores non-positive additions', () => {
  assert.deepEqual(addCartItem(cart, 3, 0), cart);
});
