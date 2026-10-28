import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function ProfileScreen() {
  const { user, setUser } = useAppContext();

  const handleLogout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{user.name}</Text>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.emptyText}>Você ainda não está logado.</Text>
          <Pressable style={styles.button} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, paddingTop: 56 },
  title: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 22 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { marginTop: 10, color: '#64748b', fontSize: 12, fontWeight: '700' },
  value: { marginTop: 4, color: '#0f172a', fontSize: 18, fontWeight: '600' },
  button: { marginTop: 20, backgroundColor: '#16a34a', padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  emptyText: { fontSize: 16, color: '#475569', marginBottom: 20 },
});
