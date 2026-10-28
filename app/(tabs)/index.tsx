import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../../src/context/AppContext';

export default function StoresScreen() {
  const { stores, searchTerm, setSearchTerm } = useAppContext();

  const filteredStores = stores.filter((store) => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return true;

    return (
      store.name.toLowerCase().includes(normalized) ||
      store.category.toLowerCase().includes(normalized) ||
      store.description.toLowerCase().includes(normalized)
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lojas</Text>
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar lojas e categorias"
        placeholderTextColor="#64748b"
        style={styles.searchInput}
      />
      <FlatList
        data={filteredStores}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Link href={`/store/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.shopName}>{item.name}</Text>
              </View>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>⭐ {item.rating}</Text>
                <Text style={styles.meta}>{item.isOpen ? 'Aberta' : 'Fechada'}</Text>
                <Text style={styles.meta}>{item.etaMin}-{item.etaMax} min</Text>
              </View>
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
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    color: '#0f172a',
  },
  list: { gap: 14, paddingBottom: 28 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emoji: { fontSize: 26 },
  shopName: { fontSize: 20, fontWeight: '700', color: '#0f172a', flexShrink: 1 },
  category: { marginTop: 8, color: '#16a34a', fontWeight: '700' },
  description: { marginTop: 8, color: '#475569', lineHeight: 20 },
  metaRow: { marginTop: 12, flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  meta: { color: '#334155', fontSize: 12, fontWeight: '600' },
});
