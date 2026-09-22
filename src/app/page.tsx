'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { api } from '@/utils/api';
import { useCart } from '@/hooks/useCart';
import { ProductCard } from '@/components/ProductCard';
import { Reviews } from '@/components/Reviews';
import { OrderForm } from '@/components/OrderForm';
import { SuccessModal } from '@/components/SuccessModal';
import './page.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { cart, addToCart, clearCart } = useCart();

  const loadProducts = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.getProducts(pageNum, 20);

      if (reset) {
        setProducts(response.items);
      } else {
        setProducts(prev => [...prev, ...response.items]);
      }

      setHasMore(response.items.length === 20 && products.length + response.items.length < response.total);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [loading, products.length]);

  // Загрузка первой страницы
  useEffect(() => {
    loadProducts(1, true);
  }, []);

  // Бесконечная прокрутка
  useEffect(() => {
    const handleScroll = () => {
      if (
        hasMore &&
        !loading &&
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, loadProducts]);

  const handleAddToCart = (productId: number, quantity: number) => {
    addToCart(productId, quantity);
  };

  const getCartQuantity = (productId: number) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleOrderSuccess = () => {
    setShowSuccessModal(true);
    clearCart();
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="page-root">
      <header className="page-header">
        <h1>Product Store</h1>
      </header>

      <div className="page-wrapper">
        <div className="page-grid">
          {/* Left Column - Reviews */}
          <div>
            <Reviews />
          </div>

          {/* Middle Column - Products */}
          <div>
            {error && (
              <div className="error-box">
                {error}
                <button onClick={() => loadProducts(1, true)} style={{ marginLeft: '8px', textDecoration: 'underline' }}>
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
              <div className="product-grid" style={{ marginTop: '24px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card">
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

          {/* Right Column - Order Form */}
          <div>
            <div style={{ position: 'sticky', top: '96px' }}>
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
        onClose={handleCloseModal}
      />
    </div>
  );
}