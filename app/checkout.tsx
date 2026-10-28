import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../src/context/AppContext';
import { formatCurrency } from '../src/lib/format';

export default function CheckoutScreen() {
  const { cart, placeOrder, user } = useAppContext();
  const [street, setStreet] = useState('Rua das Flores');
  const [number, setNumber] = useState('890');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [complement, setComplement] = useState('AP 12');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash'>('pix');
  const [changeFor, setChangeFor] = useState('50');

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Faça login para concluir o pedido.</Text>
      </View>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 5.9 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    const orderId = placeOrder({
      street,
      number,
      neighborhood,
      complement,
      paymentMethod,
      changeFor: paymentMethod === 'cash' ? Number(changeFor) || undefined : undefined,
    });

    if (orderId) {
      Alert.alert('Pedido confirmado', 'Seu pedido foi registrado com sucesso.');
      router.replace('/(tabs)/orders');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Finalizar pedido</Text>
      <Text style={styles.store}>{cart[0]?.storeName || 'Mercado Bom Preço'}</Text>

      <View style={styles.box}>
        <TextInput value={street} onChangeText={setStreet} placeholder="Rua" style={styles.input} />
        <TextInput value={number} onChangeText={setNumber} placeholder="Número" style={styles.input} />
        <TextInput value={neighborhood} onChangeText={setNeighborhood} placeholder="Bairro" style={styles.input} />
        <TextInput value={complement} onChangeText={setComplement} placeholder="Complemento" style={styles.input} />
      </View>

      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Pagamento</Text>
        {(['pix', 'card', 'cash'] as const).map((method) => (
          <Pressable
            key={method}
            onPress={() => setPaymentMethod(method)}
            style={[styles.paymentOption, paymentMethod === method && styles.paymentSelected]}
          >
            <Text style={styles.paymentText}>{method === 'pix' ? 'Pix' : method === 'card' ? 'Cartão' : 'Dinheiro'}</Text>
          </Pressable>
        ))}
        {paymentMethod === 'cash' && (
          <TextInput
            value={changeFor}
            onChangeText={setChangeFor}
            keyboardType="numeric"
            placeholder="Troco para"
            style={[styles.input, { marginTop: 10 }]}
          />
        )}
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}><Text>Subtotal</Text><Text>{formatCurrency(subtotal)}</Text></View>
        <View style={styles.summaryRow}><Text>Entrega</Text><Text>{formatCurrency(deliveryFee)}</Text></View>
        <View style={styles.summaryRow}><Text style={styles.total}>Total</Text><Text style={styles.total}>{formatCurrency(total)}</Text></View>
      </View>

      <Pressable style={styles.primaryButton} onPress={handlePlaceOrder}>
        <Text style={styles.primaryText}>Confirmar compra</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: '800', color: '#0f172a' },
  store: { marginTop: 8, color: '#16a34a', fontWeight: '700' },
  box: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 18, borderWidth: 1, borderColor: '#e2e8f0' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  paymentOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    marginBottom: 8,
  },
  paymentSelected: { backgroundColor: '#dcfce7', borderColor: '#16a34a' },
  paymentText: { fontWeight: '700', textTransform: 'capitalize' },
  summaryBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 18, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  total: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  primaryButton: { backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  emptyText: { fontSize: 18, color: '#475569' },
});
