import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const STORES = [
  { id: '1', name: 'Mercado Bom Preço', category: 'Mercado', eta: '30-45 min', deliveryFee: 'R$ 5,90' },
  { id: '2', name: 'Padaria Pão Quente', category: 'Padaria', eta: '15-25 min', deliveryFee: 'R$ 3,50' },
  { id: '3', name: 'Farmácia Vida', category: 'Farmácia', eta: '25-40 min', deliveryFee: 'R$ 6,00' },
  { id: '4', name: 'Hortifrúti da Terra', category: 'Hortifrúti', eta: '30-50 min', deliveryFee: 'R$ 4,90' },
];

export default function StoresScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lojas</Text>
      <FlatList
        data={STORES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <Text style={styles.shopName}>{item.name}</Text>
            <Text style={styles.meta}>{item.category}</Text>
            <Text style={styles.meta}>Entrega: {item.eta}</Text>
            <Text style={styles.meta}>Taxa: {item.deliveryFee}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fb', paddingTop: 60, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20, color: '#112' },
  list: { gap: 12, paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  shopName: { fontSize: 20, fontWeight: '700', color: '#112' },
  meta: { marginTop: 6, color: '#4a5568', fontSize: 14 },
});
