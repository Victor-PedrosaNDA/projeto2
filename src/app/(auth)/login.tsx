import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function LoginScreen() {
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('maria@email.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Dados inválidos', 'Informe e-mail e senha.');
      return;
    }

    setUser({
      id: 'u1',
      name: 'Maria Silva',
      email,
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MarketGo</Text>
      <Text style={styles.subtitle}>Entrar</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryText}>Entrar</Text>
      </Pressable>

      <Link href="/(auth)/register" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Criar conta</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', color: '#0f172a' },
  subtitle: { fontSize: 18, marginTop: 6, marginBottom: 24, textAlign: 'center', color: '#475569' },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbe2ea',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryText: { color: '#0f172a', fontWeight: '700' },
});
