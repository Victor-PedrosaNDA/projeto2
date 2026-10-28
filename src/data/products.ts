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

export const products: Product[] = [
  { id: 'p1', storeId: '1', section: 'Hortifrúti', name: 'Banana prata 1 kg', description: '', price: 6.9, emoji: '🍌', isActive: true },
  { id: 'p2', storeId: '1', section: 'Hortifrúti', name: 'Maçã gala 1 kg', description: '', price: 9.9, emoji: '🍏', isActive: true },
  { id: 'p3', storeId: '1', section: 'Hortifrúti', name: 'Tomate 1 kg', description: '', price: 7.5, emoji: '🍅', isActive: true },
  { id: 'p4', storeId: '1', section: 'Mercearia', name: 'Arroz branco 5 kg', description: 'Tipo 1, grãos longos.', price: 29.9, emoji: '🍚', isActive: true },
  { id: 'p5', storeId: '1', section: 'Mercearia', name: 'Feijão carioca 1 kg', description: '', price: 8.5, emoji: '🫘', isActive: true },
  { id: 'p6', storeId: '2', section: 'Pães', name: 'Pão francês (6 un)', description: 'Crocante por fora, macio por dentro.', price: 4.8, emoji: '🥖', isActive: true },
  { id: 'p7', storeId: '2', section: 'Pães', name: 'Pão de queijo (10 un)', description: '', price: 12, emoji: '🧀', isActive: true },
  { id: 'p8', storeId: '3', section: 'Analgésicos', name: 'Dipirona 500 mg (10 comp.)', description: '', price: 9.9, emoji: '💊', isActive: true },
  { id: 'p9', storeId: '3', section: 'Higiene', name: 'Sabonete 90 g', description: '', price: 2.5, emoji: '🧼', isActive: true },
  { id: 'p10', storeId: '4', section: 'Frutas', name: 'Laranja 1 kg', description: '', price: 5.9, emoji: '🍊', isActive: true },
  { id: 'p11', storeId: '5', section: 'Pizzas', name: 'Pizza Margherita', description: 'Molho, mussarela e manjericão.', price: 34.9, emoji: '🍕', isActive: true },
  { id: 'p12', storeId: '5', section: 'Pizzas', name: 'Pizza Pepperoni', description: 'Pepperoni e queijo.', price: 39.9, emoji: '🍕', isActive: true },
];
