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
};

export const stores: Store[] = [
  {
    id: '1',
    name: 'Mercado Bom Preço',
    category: 'Mercado',
    description: 'Supermercado de bairro com entrega rápida.',
    rating: 4.7,
    deliveryFee: 5.9,
    etaMin: 30,
    etaMax: 45,
    minOrder: 20,
    isOpen: true,
  },
  {
    id: '2',
    name: 'Padaria Pão Quente',
    category: 'Padaria',
    description: 'Pães e cafés saindo do forno o dia todo.',
    rating: 4.8,
    deliveryFee: 3.5,
    etaMin: 15,
    etaMax: 25,
    minOrder: 10,
    isOpen: true,
  },
  {
    id: '3',
    name: 'Farmácia Vida',
    category: 'Farmácia',
    description: 'Medicamentos e higiene, sem sair de casa.',
    rating: 4.6,
    deliveryFee: 6,
    etaMin: 25,
    etaMax: 40,
    minOrder: 15,
    isOpen: true,
  },
  {
    id: '4',
    name: 'Hortifrúti da Terra',
    category: 'Hortifrúti',
    description: 'Frutas, verduras e legumes fresquinhos.',
    rating: 4.5,
    deliveryFee: 4.9,
    etaMin: 30,
    etaMax: 50,
    minOrder: 25,
    isOpen: true,
  },
  {
    id: '5',
    name: 'Pizzaria Forno a Lenha',
    category: 'Restaurante',
    description: 'Pizzas artesanais de massa fina.',
    rating: 4.9,
    deliveryFee: 7.9,
    etaMin: 40,
    etaMax: 60,
    minOrder: 30,
    isOpen: true,
  },
  {
    id: '6',
    name: 'Sushi Sakura',
    category: 'Restaurante',
    description: 'Culinária japonesa. Volta amanhã.',
    rating: 4.4,
    deliveryFee: 9.9,
    etaMin: 45,
    etaMax: 65,
    minOrder: 40,
    isOpen: false,
  },
];
