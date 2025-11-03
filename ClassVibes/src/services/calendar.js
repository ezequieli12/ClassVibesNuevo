/**
 * Servicio de Calendario
 * Maneja la interacción con el calendario del dispositivo
 */

import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';

/**
 * Solicita permisos y obtiene los calendarios disponibles
 * @returns {Promise<Array>} Lista de calendarios
 */
export async function getCalendars() {
  try {
    // Solicitar permisos
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesita permiso de calendario para usar esta funcionalidad');
      return [];
    }

    // Obtener calendarios
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    return calendars.filter(cal => cal.allowsModifications);
  } catch (error) {
    console.error('Error al obtener calendarios:', error);
    return [];
  }
}

/**
 * Crea un evento en el calendario
 * @param {string} title - Título del evento
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @param {string} notes - Notas adicionales
 * @param {string} calendarId - ID del calendario (opcional)
 * @returns {Promise<string|null>} ID del evento creado
 */
export async function createCalendarEvent(title, startDate, endDate, notes = '', calendarId = null) {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesita permiso de calendario');
      return null;
    }

    // Si no se especifica calendario, obtener el predeterminado
    if (!calendarId) {
      const calendars = await getCalendars();
      if (calendars.length === 0) {
        Alert.alert('Error', 'No hay calendarios disponibles');
        return null;
      }
      calendarId = calendars[0].id;
    }

    // Crear evento
    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      notes,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      alarms: [
        {
          relativeOffset: -15,
          method: Calendar.AlarmMethod.ALERT,
        },
      ],
    });

    return eventId;
  } catch (error) {
    console.error('Error al crear evento:', error);
    Alert.alert('Error', 'Error al crear evento en el calendario');
    return null;
  }
}

/**
 * Obtiene eventos de un rango de fechas
 * @param {Date} startDate - Fecha inicial
 * @param {Date} endDate - Fecha final
 * @returns {Promise<Array>} Lista de eventos
 */
export async function getEventsInRange(startDate, endDate) {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      return [];
    }

    const calendars = await getCalendars();
    const events = [];

    for (const calendar of calendars) {
      const calendarEvents = await Calendar.getEventsAsync(
        [calendar.id],
        startDate,
        endDate
      );
      events.push(...calendarEvents);
    }

    return events;
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
}

