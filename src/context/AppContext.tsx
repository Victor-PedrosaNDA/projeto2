import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { marketgoService } from '../services/marketgoService';
import type { CartItem, Order, Product, Store, User } from '../types';

const productsSeed: Product[] = [];
const storesSeed: Store[] = [];

const defaultUser: User = {
  id: 'u1',
  name: 'Maria Silva',
  email: 'maria@email.com',
};

type AppContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  stores: Store[];
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  changeQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (payload: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    paymentMethod: 'pix' | 'card' | 'cash';
    changeFor?: number;
  }) => string | null;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [stores, setStores] = useState<Store[]>(storesSeed);
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([marketgoService.getStores(), marketgoService.getProducts()]).then(([nextStores, nextProducts]) => {
      if (!isMounted) return;
      setStores(nextStores);
      setProducts(nextProducts);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-1',
      userEmail: defaultUser.email,
      storeId: 's1',
      storeName: 'Mercado Bom Preço',
      items: [
        {
          productId: 'p4',
          name: 'Arroz branco 5 kg',
          emoji: '🍚',
          price: 29.9,
          quantity: 1,
          storeId: 's1',
          storeName: 'Mercado Bom Preço',
        },
      ],
      status: 'preparing',
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      subtotal: 29.9,
      deliveryFee: 5.9,
      total: 35.8,
      paymentMethod: 'card',
      addressStreet: 'Rua das Flores',
      addressNumber: '890',
      addressNeighborhood: 'Centro',
      addressComplement: 'AP 12',
    },
  ]);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const selectedStore = stores.find((s) => s.id === product.storeId);
    if (!selectedStore || !product.isActive) {
      Alert.alert('Produto indisponível', 'Este item não pode ser adicionado ao carrinho.');
      return;
    }

    const currentStoreId = cart[0]?.storeId;
    if (currentStoreId && currentStoreId !== product.storeId) {
      Alert.alert(
        'Loja diferente',
        'Seu carrinho já contém itens de outra loja. Limpe o carrinho para continuar.',
      );
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          emoji: product.emoji,
          price: product.price,
          quantity: 1,
          storeId: product.storeId,
          storeName: selectedStore.name,
        },
      ];
    });
  };

  const changeQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (payload: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    paymentMethod: 'pix' | 'card' | 'cash';
    changeFor?: number;
  }) => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para confirmar o pedido.');
      return null;
    }
    if (cart.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de finalizar.');
      return null;
    }
    const store = stores.find((s) => s.id === cart[0].storeId);
    if (!store) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = store.deliveryFee;
    const total = subtotal + deliveryFee;

    if (subtotal < store.minOrder) {
      Alert.alert('Pedido mínimo', `O pedido mínimo desta loja é R$ ${store.minOrder.toFixed(2)}.`);
      return null;
    }

    const localOrder: Order = {
      id: `ord-${Date.now()}`,
      userEmail: user.email,
      storeId: store.id,
      storeName: store.name,
      items: cart,
      status: 'received',
      createdAt: new Date().toISOString(),
      subtotal,
      deliveryFee,
      total,
      paymentMethod: payload.paymentMethod,
      changeFor: payload.paymentMethod === 'cash' ? payload.changeFor : undefined,
      addressStreet: payload.street,
      addressNumber: payload.number,
      addressNeighborhood: payload.neighborhood,
      addressComplement: payload.complement,
    };

    setOrders((prev) => [localOrder, ...prev]);
    setCart([]);

    const remotePayload = {
      userId: user.id,
      storeId: store.id,
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      address: {
        street: payload.street,
        number: payload.number,
        neighborhood: payload.neighborhood,
        complement: payload.complement,
      },
      paymentMethod: payload.paymentMethod,
      changeFor: payload.paymentMethod === 'cash' ? payload.changeFor : undefined,
    };

    marketgoService.createOrder(remotePayload).then((serverOrder) => {
      if (!serverOrder) return;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === localOrder.id
            ? {
                ...order,
                id: serverOrder.id,
                status: (serverOrder.status as Order['status']) ?? 'received',
                subtotal: serverOrder.subtotal,
                deliveryFee: serverOrder.deliveryFee,
                total: serverOrder.total,
              }
            : order,
        ),
      );
    });

    return localOrder.id;
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      stores,
      products,
      searchTerm,
      setSearchTerm,
      cart,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
      orders,
      placeOrder,
    }),
    [user, stores, products, searchTerm, cart, orders],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
}
