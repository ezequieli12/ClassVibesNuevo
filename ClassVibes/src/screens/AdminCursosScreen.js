/**
 * Pantalla de Administración de Cursos
 * Permite ver, editar y eliminar cursos
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

export default function AdminCursosScreen({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('cursos').select('*').order('idcurso');

      if (!error && data) {
        setCursos(data);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los cursos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = (curso) => {
    Alert.alert(
      'Eliminar curso',
      `¿Estás seguro de que querés eliminar "${curso.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('cursos')
              .delete()
              .eq('idcurso', curso.idcurso);
            
            if (!error) {
              cargarCursos();
              Alert.alert('Éxito', 'Curso eliminado correctamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el curso');
            }
          },
        },
      ]
    );
  };

  const renderCurso = ({ item }) => (
    <View style={styles.cursoCard}>
      <View style={styles.cursoInfo}>
        <Text style={styles.cursoNombre}>{item.nombre}</Text>
        <Text style={styles.cursoPrecio}>${item.precio}</Text>
        <Text style={styles.cursoMateria}>{item.materia || 'Sin materia'}</Text>
      </View>
      <View style={styles.cursoActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            Alert.alert('Info', 'Funcionalidad de edición en desarrollo');
          }}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleEliminar(item)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && cursos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007CF0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Cursos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CrearCurso')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {cursos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No hay cursos cargados</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('CrearCurso')}
          >
            <Text style={styles.emptyButtonText}>Crear Primer Curso</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cursos}
          renderItem={renderCurso}
          keyExtractor={(item) => item.idcurso.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={cargarCursos} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007CF0',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  cursoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cursoInfo: {
    flex: 1,
  },
  cursoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cursoPrecio: {
    fontSize: 16,
    color: '#007CF0',
    fontWeight: '600',
    marginBottom: 4,
  },
  cursoMateria: {
    fontSize: 14,
    color: '#666',
  },
  cursoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007CF0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

