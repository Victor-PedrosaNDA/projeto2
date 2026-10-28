import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../src/context/AppContext';
import { formatCurrency, formatDateTime } from '../../src/lib/format';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useAppContext();
  const order = orders.find((item) => item.id === id);

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Pedido não encontrado.</Text>
      </View>
    );
  }

  const timeline = [
    { key: 'received', label: 'Recebido' },
    { key: 'preparing', label: 'Em preparo' },
    { key: 'out_for_delivery', label: 'Saiu para entrega' },
    { key: 'delivered', label: 'Entregue' },
  ];

  const currentIndex = timeline.findIndex((item) => item.key === order.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pedido #{order.id}</Text>
      <Text style={styles.store}>{order.storeName}</Text>
      <Text style={styles.meta}>{formatDateTime(order.createdAt)}</Text>

      <View style={styles.box}>
        {timeline.map((step, index) => (
          <View key={step.key} style={styles.stepRow}>
            <View style={[styles.dot, index <= currentIndex ? styles.dotActive : null]} />
            <Text style={[styles.stepText, index <= currentIndex ? styles.stepTextActive : null]}>{step.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.box}>
        {order.items.map((item) => (
          <View key={item.productId} style={styles.itemRow}>
            <Text>{item.emoji} {item.name}</Text>
            <Text>{item.quantity}x</Text>
            <Text>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.box}>
        <Text style={styles.summaryTitle}>Resumo</Text>
        <View style={styles.summaryRow}><Text>Subtotal</Text><Text>{formatCurrency(order.subtotal)}</Text></View>
        <View style={styles.summaryRow}><Text>Entrega</Text><Text>{formatCurrency(order.deliveryFee)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.total}>Total</Text><Text style={styles.total}>{formatCurrency(order.total)}</Text></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  store: { marginTop: 8, fontSize: 18, fontWeight: '700', color: '#16a34a' },
  meta: { marginTop: 4, color: '#64748b' },
  box: { marginTop: 18, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#cbd5e1', marginRight: 10 },
  dotActive: { backgroundColor: '#16a34a' },
  stepText: { color: '#64748b', fontWeight: '600' },
  stepTextActive: { color: '#0f172a' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  total: { fontWeight: '800', color: '#0f172a' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  emptyText: { fontSize: 18, color: '#475569' },
});
