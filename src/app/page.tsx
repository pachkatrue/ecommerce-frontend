'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '@/types';
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
    if (loadingRef.current) {
      return;
    }

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

  const handleAddToCart = (productId: number, quantity: number) => {
    addToCart(productId, quantity);
  };

  const getCartQuantity = (productId: number) =>
    cart.find((item) => item.id === productId)?.quantity ?? 0;

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
          <div>
            <Reviews />
          </div>

          <div>
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

            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={getCartQuantity(product.id)}
                  onAddToCart={(quantity) => handleAddToCart(product.id, quantity)}
                />
              ))}
            </div>

            {loading && (
              <div
                className="product-grid"
                style={{ marginTop: '24px' }}
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

            {!hasMore && products.length > 0 && (
              <div className="load-complete">All products loaded</div>
            )}
          </div>

          <div>
            <div className="order-sidebar">
              <OrderForm
                cart={cart}
                products={products}
                onOrderSuccess={handleOrderSuccess}
              />
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
