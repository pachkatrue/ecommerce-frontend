'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/types';
import { api } from '@/utils/api';
import { useCart } from '@/hooks/useCart';
import { ProductCard } from '@/components/ProductCard';
import { Reviews } from '@/components/Reviews';
import { OrderForm } from '@/components/OrderForm';
import { SuccessModal } from '@/components/SuccessModal';
import './page.css';

const PAGE_SIZE = 20;
const LOAD_THRESHOLD_PX = 1000;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const loadingRef = useRef(false);

  const { cart, addToCart, setQuantity, clearCart } = useCart();

  const loadProducts = useCallback(async (pageNumber: number, reset = false) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await api.getProducts(pageNumber, PAGE_SIZE);

      setProducts((currentProducts) =>
        reset ? response.items : [...currentProducts, ...response.items],
      );
      setHasMore(pageNumber * PAGE_SIZE < response.total);
      setPage(pageNumber);
    } catch {
      setError('Failed to load products');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts(1, true);
  }, [loadProducts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        hasMore &&
        !loadingRef.current &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - LOAD_THRESHOLD_PX
      ) {
        void loadProducts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadProducts, page]);

  const cartQuantityById = useMemo(
    () => new Map(cart.map((item) => [item.id, item.quantity])),
    [cart],
  );

  const handleOrderSuccess = () => {
    setShowSuccessModal(true);
    clearCart();
  };

  return (
    <div className="page-root">
      <header className="page-header">
        <h1>Product Store</h1>
      </header>

      <div className="page-wrapper">
        <div className="page-grid">
          <div className="reviews-column">
            <Reviews />
          </div>

          <main>
            {error && (
              <div className="error-box" role="alert">
                {error}
                <button
                  type="button"
                  onClick={() => void loadProducts(1, true)}
                  className="retry-button"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="empty-products" role="status">
                No products available.
              </div>
            )}

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={cartQuantityById.get(product.id) ?? 0}
                  onAddToCart={(quantity) => addToCart(product.id, quantity)}
                  onSetQuantity={(quantity) => setQuantity(product.id, quantity)}
                />
              ))}
            </div>

            {loading && (
              <div
                className="product-grid loading-grid"
                aria-label="Loading products"
                aria-busy="true"
              >
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="skeleton-card" aria-hidden="true">
                    <div className="img" />
                    <div className="content">
                      <div className="skeleton-line w-100" />
                      <div className="skeleton-line w-75" />
                      <div className="skeleton-line w-50" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !hasMore && products.length > 0 && (
              <div className="load-complete" role="status">
                All products loaded
              </div>
            )}
          </main>

          <aside className="order-sidebar">
            <OrderForm
              cart={cart}
              products={products}
              onOrderSuccess={handleOrderSuccess}
            />
          </aside>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
