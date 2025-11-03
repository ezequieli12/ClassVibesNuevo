/**
 * Pantalla de Login
 * Autenticación de usuarios
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ username: '', contraseña: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.username || !form.contraseña) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('username', form.username)
        .eq('contraseña', form.contraseña)
        .single();

      if (data && !error) {
        await AsyncStorage.setItem('usuario', JSON.stringify(data));
        navigation.replace('Main');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>ClassVibes</Text>
        <Text style={styles.subtitle}>Iniciar Sesión</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={form.username}
              onChangeText={(value) => handleChange('username', value)}
              placeholder="Ingrese su usuario"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={form.contraseña}
              onChangeText={(value) => handleChange('contraseña', value)}
              placeholder="Ingrese su contraseña"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007CF0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007CF0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

