/**
 * Servicio de Alertas
 * Maneja las alertas y recordatorios de la aplicación
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { schedulePushNotification } from './notifications';

const ALERTS_KEY = '@classvibes_alerts';

/**
 * Obtiene todas las alertas guardadas
 * @returns {Promise<Array>}
 */
export async function getAlerts() {
  try {
    const data = await AsyncStorage.getItem(ALERTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    return [];
  }
}

/**
 * Guarda una nueva alerta
 * @param {Object} alert - Objeto con {id, title, message, date, type}
 * @returns {Promise<boolean>}
 */
export async function saveAlert(alert) {
  try {
    const alerts = await getAlerts();
    const newAlert = {
      id: Date.now().toString(),
      ...alert,
      createdAt: new Date().toISOString(),
    };
    
    alerts.push(newAlert);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
    
    // Si tiene fecha, programar notificación
    if (newAlert.date) {
      const alertDate = new Date(newAlert.date);
      if (alertDate > new Date()) {
        await schedulePushNotification(
          newAlert.title,
          newAlert.message,
          alertDate
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error al guardar alerta:', error);
    return false;
  }
}

/**
 * Elimina una alerta
 * @param {string} alertId - ID de la alerta
 * @returns {Promise<boolean>}
 */
export async function deleteAlert(alertId) {
  try {
    const alerts = await getAlerts();
    const filtered = alerts.filter(a => a.id !== alertId);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    return false;
  }
}

/**
 * Marca una alerta como leída
 * @param {string} alertId - ID de la alerta
 * @returns {Promise<boolean>}
 */
export async function markAlertAsRead(alertId) {
  try {
    const alerts = await getAlerts();
    const updated = alerts.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    );
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error al marcar alerta:', error);
    return false;
  }
}

