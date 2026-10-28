import { products, stores } from '../data/mockData';
import type { CartItem, Order, Product, Store } from '../types';
import { supabase } from './supabase';

async function loadFromSupabase<T>(table: string): Promise<T[] | null> {
  if (!supabase) return null;

  const { data, error } = await supabase.from(table).select('*');
  if (error || !data) return null;
  return data as T[];
}

export type CreateOrderInput = {
  userId: string;
  storeId: string;
  items: Array<{ productId: string; quantity: number }>;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
  };
  paymentMethod: 'pix' | 'card' | 'cash';
  changeFor?: number;
};

export const marketgoService = {
  async getStores(): Promise<Store[]> {
    const remote = await loadFromSupabase<Store>('stores');
    return remote ?? stores;
  },

  async getProducts(): Promise<Product[]> {
    const remote = await loadFromSupabase<Product>('products');
    return remote ?? products;
  },

  async getStoreById(storeId: string): Promise<Store | undefined> {
    const list = await this.getStores();
    return list.find((store) => store.id === storeId);
  },

  async getProductsByStore(storeId: string): Promise<Product[]> {
    const list = await this.getProducts();
    return list.filter((product) => product.storeId === storeId && product.isActive);
  },

  async createOrder(input: CreateOrderInput): Promise<{ id: string; status: string; subtotal: number; deliveryFee: number; total: number } | null> {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase.rpc('create_order', {
      p_user_id: input.userId,
      p_store_id: input.storeId,
      p_items: input.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      p_address_street: input.address.street,
      p_address_number: input.address.number,
      p_address_neighborhood: input.address.neighborhood,
      p_address_complement: input.address.complement ?? null,
      p_payment_method: input.paymentMethod,
      p_change_for: input.changeFor ?? null,
    });

    if (error || !data) {
      return null;
    }

    return data as { id: string; status: string; subtotal: number; deliveryFee: number; total: number };
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error || !data) {
      return [];
    }

    return data as Order[];
  },

  async getOrderItems(orderId: string): Promise<CartItem[]> {
    if (!supabase) {
      return [];
    }

    const { data, error } = await supabase.from('order_items').select('*').eq('order_id', orderId);
    if (error || !data) {
      return [];
    }

    return data as CartItem[];
  },
};
