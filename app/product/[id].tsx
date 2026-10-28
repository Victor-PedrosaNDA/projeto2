import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../src/context/AppContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart, products } = useAppContext();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{product.emoji}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.section}>{product.section}</Text>
      <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description || 'Produto disponível para entrega.'}</Text>

      <Pressable style={styles.button} onPress={() => addToCart(product.id)}>
        <Text style={styles.buttonText}>Adicionar ao carrinho</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 24 },
  emoji: { fontSize: 56 },
  name: { marginTop: 14, fontSize: 28, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  section: { marginTop: 8, color: '#16a34a', fontWeight: '700', fontSize: 16 },
  price: { marginTop: 12, fontSize: 22, fontWeight: '800', color: '#0f172a' },
  description: { marginTop: 16, color: '#475569', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  button: { marginTop: 24, backgroundColor: '#16a34a', paddingHorizontal: 22, paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '800' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  emptyText: { fontSize: 18, color: '#475569' },
});
