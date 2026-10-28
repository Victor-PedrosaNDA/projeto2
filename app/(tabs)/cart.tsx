import { Link, router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../src/context/AppContext';
import { formatCurrency } from '../../src/lib/format';

export default function CartScreen() {
  const { cart, changeQuantity, removeFromCart, user } = useAppContext();

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
        <Text style={styles.emptyText}>Adicione produtos da loja para continuar.</Text>
      </View>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart[0]?.storeName ? 5.9 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login antes de finalizar seu pedido.');
      router.push('/(auth)/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Carrinho</Text>
      <Text style={styles.storeName}>{cart[0]?.storeName}</Text>

      {cart.map((item) => (
        <View key={item.productId} style={styles.itemCard}>
          <View style={styles.itemTitleRow}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <Text style={styles.itemName}>{item.name}</Text>
          </View>

          <View style={styles.itemFooter}>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            <View style={styles.qtyRow}>
              <Pressable style={styles.qtyButton} onPress={() => changeQuantity(item.productId, -1)}>
                <Text style={styles.qtyText}>−</Text>
              </Pressable>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Pressable style={styles.qtyButton} onPress={() => changeQuantity(item.productId, 1)}>
                <Text style={styles.qtyText}>＋</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => removeFromCart(item.productId)}>
              <Text style={styles.removeText}>Remover</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Entrega</Text>
          <Text>{formatCurrency(deliveryFee)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>{formatCurrency(total)}</Text>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleCheckout}>
        <Text style={styles.primaryText}>Finalizar pedido</Text>
      </Pressable>

      <Link href="/(tabs)" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Continuar comprando</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 18, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  storeName: { fontSize: 16, color: '#16a34a', fontWeight: '700', marginBottom: 18 },
  itemCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemEmoji: { fontSize: 24 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#0f172a', flex: 1 },
  itemFooter: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  price: { fontWeight: '700', color: '#0f172a' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  qty: { fontWeight: '700', color: '#0f172a' },
  removeText: { color: '#ef4444', fontWeight: '600' },
  summaryBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalRow: { marginTop: 8, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 12 },
  totalText: { fontWeight: '800', fontSize: 18, color: '#0f172a' },
  primaryButton: { backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  secondaryButton: { backgroundColor: '#fff', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#dbe2ea' },
  secondaryText: { color: '#0f172a', fontWeight: '700' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 24 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  emptyText: { color: '#475569', textAlign: 'center' },
});
