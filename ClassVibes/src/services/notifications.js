/**
 * Servicio de Notificaciones
 * Maneja el registro y envío de notificaciones push
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Registra el dispositivo para recibir notificaciones push
 * @returns {Promise<string|null>} Token de notificación o null si no se pudo obtener
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#007CF0',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permisos', 'Se necesita permiso para enviar notificaciones!');
      return null;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Token de notificación:', token);
    
    // Guardar token en AsyncStorage para uso posterior
    await AsyncStorage.setItem('notificationToken', token);
  } else {
    Alert.alert('Aviso', 'Debe usar un dispositivo físico para recibir notificaciones push');
  }

  return token;
}

/**
 * Programa una notificación local
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 * @param {Date} triggerDate - Fecha y hora para la notificación
 */
export async function schedulePushNotification(title, body, triggerDate) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: triggerDate,
  });
}

/**
 * Cancela todas las notificaciones programadas
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Obtiene el token de notificación guardado
 * @returns {Promise<string|null>}
 */
export async function getNotificationToken() {
  return await AsyncStorage.getItem('notificationToken');
}

