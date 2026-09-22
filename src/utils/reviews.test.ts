import { describe, expect, it } from 'vitest';
import { reviewTextToPlainText } from './reviews';

describe('reviewTextToPlainText', () => {
  it('removes markup before rendering external review text', () => {
    expect(reviewTextToPlainText('<strong>Anna</strong><br>Hello')).toBe('Anna Hello');
  });
});