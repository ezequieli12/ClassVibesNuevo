/**
 * Pantalla de Ubicaciones (Location)
 * Muestra la ubicación actual y cursos/profesores cercanos
 * Funcionalidad: Location
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentLocation, calculateDistance } from '../services/location';
import { supabase } from '../services/supabase';

export default function LocationScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Obtener ubicación del usuario
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
        setMapRegion({
          ...mapRegion,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }

      // Cargar cursos (simularemos ubicaciones, ya que la BD puede no tener coordenadas)
      const { data } = await supabase.from('cursos').select('*, profesores(nombre)');
      
      // Asignar ubicaciones simuladas a los cursos
      if (data && location) {
        const cursosConUbicacion = data.map((curso, index) => ({
          ...curso,
          latitude: location.latitude + (Math.random() - 0.5) * 0.1,
          longitude: location.longitude + (Math.random() - 0.5) * 0.1,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            location.latitude + (Math.random() - 0.5) * 0.1,
            location.longitude + (Math.random() - 0.5) * 0.1
          ),
        }));
        
        cursosConUbicacion.sort((a, b) => a.distance - b.distance);
        setCursos(cursosConUbicacion);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información de ubicación');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarUbicacion = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location);
      setMapRegion({
        ...mapRegion,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      Alert.alert('Ubicación actualizada', 'Tu ubicación ha sido actualizada');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007CF0" />
        <Text style={styles.loadingText}>Cargando ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Mapa */}
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcador del usuario */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Tu ubicación"
            pinColor="#007CF0"
          />
        )}

        {/* Marcadores de cursos */}
        {cursos.map((curso, index) => (
          <Marker
            key={curso.idcurso || index}
            coordinate={{
              latitude: curso.latitude,
              longitude: curso.longitude,
            }}
            title={curso.nombre}
            description={`${curso.profesores?.nombre || 'Profesor'} - ${curso.distance?.toFixed(2) || 0} km`}
          />
        ))}
      </MapView>

      {/* Lista de cursos cercanos */}
      <View style={styles.listContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Cursos Cercanos</Text>
          <TouchableOpacity onPress={actualizarUbicacion} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#007CF0" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {cursos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay cursos cercanos</Text>
            </View>
          ) : (
            cursos.slice(0, 5).map((curso, index) => (
              <View key={curso.idcurso || index} style={styles.cursoCard}>
                <View style={styles.cursoHeader}>
                  <Text style={styles.cursoName}>{curso.nombre}</Text>
                  <View style={styles.distanceBadge}>
                    <Ionicons name="location" size={14} color="#007CF0" />
                    <Text style={styles.distanceText}>
                      {curso.distance?.toFixed(2) || 0} km
                    </Text>
                  </View>
                </View>
                <Text style={styles.cursoProfesor}>
                  {curso.profesores?.nombre || 'Profesor no disponible'}
                </Text>
                <Text style={styles.cursoMateria}>{curso.materia || 'Materia'}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    height: 250,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  cursoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007CF0',
  },
  cursoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cursoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#007CF0',
    fontWeight: '600',
  },
  cursoProfesor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cursoMateria: {
    fontSize: 12,
    color: '#999',
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
});

