export type Store = {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  deliveryFee: number;
  etaMin: number;
  etaMax: number;
  minOrder: number;
  isOpen: boolean;
  emoji: string;
};

export type Product = {
  id: string;
  storeId: string;
  section: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  isActive: boolean;
};

export type CartItem = {
  productId: string;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
};

export type OrderStatus = 'received' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userEmail: string;
  storeId: string;
  storeName: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'pix' | 'card' | 'cash';
  changeFor?: number;
  addressStreet: string;
  addressNumber: string;
  addressNeighborhood: string;
  addressComplement?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};
