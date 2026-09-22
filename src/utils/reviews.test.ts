import assert from 'node:assert/strict';
import test from 'node:test';
import { reviewTextToPlainText } from './reviews.ts';

test('reviewTextToPlainText removes markup before rendering external review text', () => {
  assert.equal(
    reviewTextToPlainText('<strong>Anna</strong><br>Hello'),
    'Anna Hello',
  );
});
