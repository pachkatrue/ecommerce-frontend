import type { OrderRequest, OrderResponse, ProductsResponse, Review } from '@/types';
import { mockStore } from '@/data/mockStore';

export const api = {
  async getReviews(): Promise<Review[]> {
    return mockStore.getReviews();
  },

  async getProducts(page = 1, pageSize = 20): Promise<ProductsResponse> {
    return mockStore.getProducts(page, pageSize);
  },

  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    return mockStore.createOrder(orderData);
  },
};
