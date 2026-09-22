'use client';

import { useEffect, useState } from 'react';
import type { Review } from '@/types';
import { api } from '@/utils/api';
import { reviewTextToPlainText } from '@/utils/reviews';
import './reviews.css';

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void api.getReviews().then((data) => {
      if (active) setReviews(data);
    }).catch(() => {
      if (active) setError('Не удалось загрузить отзывы');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  if (loading) return <section className="reviews-container" aria-busy="true" aria-label="Загрузка отзывов">{Array.from({ length: 2 }, (_, i) => <div key={i} className="review-card skeleton-card" aria-hidden="true" />)}</section>;
  if (error) return <section className="review-error" role="alert">{error}</section>;
  if (!reviews.length) return <section className="review-empty">Пока нет отзывов.</section>;

  return (
    <section className="reviews-container" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="sr-only">Отзывы</h2>
      {reviews.map((review) => <article key={review.id} className="review-card"><p>{reviewTextToPlainText(review.text)}</p></article>)}
    </section>
  );
};