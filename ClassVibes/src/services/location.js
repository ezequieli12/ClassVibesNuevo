/**
 * Servicio de Ubicación
 * Maneja permisos y obtención de ubicación del usuario
 */

import * as Location from 'expo-location';
import { Alert } from 'react-native';

/**
 * Solicita permisos de ubicación y obtiene la posición actual del usuario
 * @returns {Promise<{latitude: number, longitude: number}|null>}
 */
export async function getCurrentLocation() {
  try {
    // Verificar si ya tenemos permisos
    let { status } = await Location.getForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      // Solicitar permisos
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permisos', 'Se necesita permiso de ubicación para usar esta funcionalidad');
        return null;
      }
    }

    // Obtener ubicación actual
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    Alert.alert('Error', 'Error al obtener la ubicación');
    return null;
  }
}

/**
 * Calcula la distancia entre dos puntos geográficos (Haversine)
 * @param {number} lat1 - Latitud punto 1
 * @param {number} lon1 - Longitud punto 1
 * @param {number} lat2 - Latitud punto 2
 * @param {number} lon2 - Longitud punto 2
 * @returns {number} Distancia en kilómetros
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

