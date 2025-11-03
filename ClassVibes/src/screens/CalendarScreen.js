/**
 * Pantalla de Calendario (Calendar)
 * Muestra y gestiona eventos de clases
 * Funcionalidad: Calendar
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
// Usaremos expo-calendar directamente sin componente de UI externo
import { Ionicons } from '@expo/vector-icons';
import { getCalendars, createCalendarEvent, getEventsInRange } from '../services/calendar';
import { schedulePushNotification } from '../services/notifications';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hora después
  });
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    cargarEventos();
  }, []);

  useEffect(() => {
    cargarEventosFecha();
  }, [selectedDate]);

  const cargarEventos = async () => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const eventos = await getEventsInRange(startDate, endDate);
      
      // Crear objeto de fechas marcadas
      const marked = {};
      eventos.forEach((evento) => {
        const fecha = new Date(evento.startDate).toISOString().split('T')[0];
        if (!marked[fecha]) {
          marked[fecha] = {
            marked: true,
            dotColor: '#007CF0',
            selected: selectedDate === fecha,
            selectedColor: '#007CF0',
          };
        }
      });

      // Marcar fecha seleccionada
      if (marked[selectedDate]) {
        marked[selectedDate].selected = true;
        marked[selectedDate].selectedColor = '#007CF0';
      } else {
        marked[selectedDate] = {
          selected: true,
          selectedColor: '#007CF0',
        };
      }

      setMarkedDates(marked);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    }
  };

  const cargarEventosFecha = async () => {
    try {
      const fecha = new Date(selectedDate);
      const startOfDay = new Date(fecha);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(fecha);
      endOfDay.setHours(23, 59, 59, 999);

      const eventos = await getEventsInRange(startOfDay, endOfDay);
      setEvents(eventos);
    } catch (error) {
      console.error('Error al cargar eventos de fecha:', error);
    }
  };

  const handleSaveEvent = async () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Error', 'Por favor ingrese un título para el evento');
      return;
    }

    try {
      const eventId = await createCalendarEvent(
        newEvent.title,
        newEvent.startDate,
        newEvent.endDate,
        newEvent.description
      );

      if (eventId) {
        // Programar notificación
        await schedulePushNotification(
          newEvent.title,
          `Clase: ${newEvent.title}`,
          newEvent.startDate
        );

        Alert.alert('Éxito', 'Evento creado en el calendario');
        setModalVisible(false);
        setNewEvent({
          title: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 60 * 1000),
        });
        cargarEventos();
        cargarEventosFecha();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el evento');
      console.error(error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderEvent = (evento, index) => {
    const startDate = new Date(evento.startDate);
    const endDate = new Date(evento.endDate);

    return (
      <View key={index} style={styles.eventCard}>
        <View style={styles.eventTime}>
          <Text style={styles.eventTimeText}>
            {formatTime(startDate)}
          </Text>
          <Text style={styles.eventTimeText}>
            {formatTime(endDate)}
          </Text>
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{evento.title}</Text>
          {evento.notes && (
            <Text style={styles.eventDescription}>{evento.notes}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Calendario - Vista simplificada */}
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => {
              const date = new Date(selectedDate);
              date.setMonth(date.getMonth() - 1);
              setSelectedDate(date.toISOString().split('T')[0]);
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#007CF0" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {new Date(selectedDate).toLocaleDateString('es-AR', {
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const date = new Date(selectedDate);
              date.setMonth(date.getMonth() + 1);
              setSelectedDate(date.toISOString().split('T')[0]);
            }}
          >
            <Ionicons name="chevron-forward" size={24} color="#007CF0" />
          </TouchableOpacity>
        </View>
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>
            Fecha seleccionada: {new Date(selectedDate).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Eventos del día */}
      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>
            Eventos del {new Date(selectedDate).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
            })}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const fecha = new Date(selectedDate);
              fecha.setHours(9, 0, 0);
              setNewEvent({
                ...newEvent,
                startDate: fecha,
                endDate: new Date(fecha.getTime() + 60 * 60 * 1000),
              });
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay eventos programados</Text>
            <Text style={styles.emptySubtext}>
              Toca el botón + para agregar un evento
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.eventsList}>
            {events.map((evento, index) => renderEvent(evento, index))}
          </ScrollView>
        )}
      </View>

      {/* Modal para crear evento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Evento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Título del evento"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              value={newEvent.description}
              onChangeText={(text) =>
                setNewEvent({ ...newEvent, description: text })
              }
              multiline
              numberOfLines={3}
            />

            <View style={styles.timeContainer}>
              <View style={styles.timeButton}>
                <Ionicons name="time-outline" size={20} color="#007CF0" />
                <Text style={styles.timeButtonText}>
                  Inicio: {formatTime(newEvent.startDate)}
                </Text>
              </View>

              <View style={styles.timeButton}>
                <Ionicons name="time-outline" size={20} color="#007CF0" />
                <Text style={styles.timeButtonText}>
                  Fin: {formatTime(newEvent.endDate)}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
              <Text style={styles.saveButtonText}>Guardar Evento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: -10,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007CF0',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007CF0',
  },
  eventTime: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTimeText: {
    fontSize: 12,
    color: '#007CF0',
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeContainer: {
    marginBottom: 20,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  selectedDateContainer: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#007CF0',
    fontWeight: '600',
    textAlign: 'center',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#007CF0',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007CF0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

