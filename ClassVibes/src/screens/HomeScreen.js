/**
 * Pantalla principal (Home)
 * Muestra reseñas y contenido destacado
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('RESEÑAS')
        .select('texto, idAlumno, USUARIO(nombre, fotoPerfil)')
        .limit(10)
        .order('idResena', { ascending: false });

      if (!error && data) {
        setResenas(data);
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={cargarResenas} />
      }
    >
      {/* Header con gradiente */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Cambiando el mundo,{'\n'}una mente a la vez.
        </Text>
      </View>

      {/* Sección de reseñas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reseñas de Estudiantes</Text>
        
        {resenas.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay reseñas disponibles</Text>
          </View>
        ) : (
          resenas.map((r, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image
                  source={{
                    uri: r.USUARIO?.fotoPerfil || 'https://via.placeholder.com/50',
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.userName}>
                  {r.USUARIO?.nombre || 'Usuario'}
                </Text>
              </View>
              <Text style={styles.resenaText}>
                "{r.texto.length > 120 ? r.texto.slice(0, 120) + '...' : r.texto}"
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Botones de acceso rápido */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.quickActionText}>Ver Calendario</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => navigation.navigate('Location')}
        >
          <Ionicons name="location" size={24} color="#fff" />
          <Text style={styles.quickActionText}>Ubicaciones</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#007CF0',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007CF0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resenaText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#007CF0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

