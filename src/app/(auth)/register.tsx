import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function RegisterScreen() {
  const { setUser } = useAppContext();
  const [name, setName] = useState('Maria Silva');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Dados inválidos', 'Preencha todos os campos.');
      return;
    }

    setUser({
      id: 'u1',
      name,
      email,
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Nome" style={styles.input} />
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

      <Pressable style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryText}>Cadastrar</Text>
      </Pressable>

      <Link href="/(auth)/login" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Já tenho conta</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 24, textAlign: 'center', color: '#0f172a' },
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
