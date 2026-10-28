import { Link, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../src/context/AppContext';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, stores, products } = useAppContext();
  const store = stores.find((item) => item.id === id);

  if (!store) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loja não encontrada.</Text>
      </View>
    );
  }

  const storeProducts = products.filter((item) => item.storeId === store.id && item.isActive);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{store.name}</Text>
      <Text style={styles.subtitle}>{store.description}</Text>
      <Text style={styles.meta}>⭐ {store.rating} • {store.isOpen ? 'Aberta' : 'Fechada'} • {store.etaMin}-{store.etaMax} min</Text>

      <FlatList
        data={storeProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.emoji}>{item.emoji}</Text>
              <View style={styles.cardBody}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription}>{item.description || 'Produto disponível.'}</Text>
              </View>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
              <Pressable style={styles.addButton} onPress={() => addToCart(item.id)}>
                <Text style={styles.addText}>Adicionar</Text>
              </Pressable>
            </View>
            <Link href={`/product/${item.id}`} asChild>
              <Pressable style={styles.detailsButton}>
                <Text style={styles.detailsText}>Detalhes</Text>
              </Pressable>
            </Link>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 56, paddingHorizontal: 16 },
  title: { fontSize: 30, fontWeight: '800', color: '#0f172a' },
  subtitle: { marginTop: 8, color: '#475569', fontSize: 15 },
  meta: { marginTop: 10, marginBottom: 18, color: '#16a34a', fontWeight: '700' },
  list: { gap: 12, paddingBottom: 28 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  emoji: { fontSize: 28 },
  cardBody: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  productDescription: { marginTop: 4, color: '#64748b', lineHeight: 18 },
  footerRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontWeight: '800', color: '#0f172a', fontSize: 17 },
  addButton: { backgroundColor: '#16a34a', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: '800' },
  detailsButton: { marginTop: 12, backgroundColor: '#eef2ff', padding: 10, borderRadius: 10, alignItems: 'center' },
  detailsText: { color: '#3730a3', fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  emptyText: { fontSize: 18, color: '#475569' },
});
