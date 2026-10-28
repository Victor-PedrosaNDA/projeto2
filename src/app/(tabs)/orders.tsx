import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDateTime } from '../../lib/format';

export default function OrdersScreen() {
  const { orders } = useAppContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/order/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.orderName}>{item.storeName}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <Text style={styles.meta}>{formatDateTime(item.createdAt)}</Text>
              <Text style={styles.meta}>{item.items.length} itens</Text>
              <Text style={styles.total}>{formatCurrency(item.total)}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 56, paddingHorizontal: 16 },
  title: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 18 },
  list: { gap: 12, paddingBottom: 28 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  orderName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  status: { color: '#16a34a', fontWeight: '700', textTransform: 'capitalize' },
  meta: { marginTop: 6, color: '#475569' },
  total: { marginTop: 10, fontWeight: '800', fontSize: 18, color: '#0f172a' },
});
