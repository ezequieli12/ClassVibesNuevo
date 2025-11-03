/**
 * Pantalla de Alertas (Alerts)
 * Gestiona alertas y recordatorios para clases
 * Funcionalidad: Alerts
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert as RNAlert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAlerts, saveAlert, deleteAlert, markAlertAsRead } from '../services/alerts';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    date: new Date(),
    type: 'info',
  });

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    const data = await getAlerts();
    setAlerts(data);
  };

  const handleSave = async () => {
    if (!newAlert.title.trim() || !newAlert.message.trim()) {
      RNAlert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    const success = await saveAlert(newAlert);
    if (success) {
      setModalVisible(false);
      setNewAlert({ title: '', message: '', date: new Date(), type: 'info' });
      cargarAlertas();
      RNAlert.alert('Éxito', 'Alerta creada correctamente');
    } else {
      RNAlert.alert('Error', 'No se pudo crear la alerta');
    }
  };

  const handleDelete = async (alertId) => {
    RNAlert.alert(
      'Eliminar alerta',
      '¿Estás seguro de que deseas eliminar esta alerta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteAlert(alertId);
            cargarAlertas();
          },
        },
      ]
    );
  };

  const handleMarkAsRead = async (alertId) => {
    await markAlertAsRead(alertId);
    cargarAlertas();
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      case 'success':
        return 'checkmark-circle';
      default:
        return 'information-circle';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      case 'success':
        return '#4caf50';
      default:
        return '#007CF0';
    }
  };

  const renderAlert = ({ item }) => {
    const alertDate = new Date(item.date);
    const isPast = alertDate < new Date();
    const isRead = item.read || false;

    return (
      <View
        style={[
          styles.alertCard,
          isPast && styles.alertCardPast,
          isRead && styles.alertCardRead,
        ]}
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertTitleContainer}>
            <Ionicons
              name={getAlertIcon(item.type)}
              size={24}
              color={getAlertColor(item.type)}
            />
            <Text style={styles.alertTitle}>{item.title}</Text>
          </View>
          {!isRead && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>Nueva</Text>
            </View>
          )}
        </View>

        <Text style={styles.alertMessage}>{item.message}</Text>

        <View style={styles.alertFooter}>
          <Text style={styles.alertDate}>
            {alertDate.toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <View style={styles.alertActions}>
            {!isRead && (
              <TouchableOpacity
                onPress={() => handleMarkAsRead(item.id)}
                style={styles.actionButton}
              >
                <Ionicons name="checkmark" size={20} color="#4caf50" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Alertas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No tienes alertas</Text>
          <Text style={styles.emptySubtext}>
            Crea una nueva alerta para recordar tus clases y eventos
          </Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Modal para crear nueva alerta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Alerta</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Título de la alerta"
              value={newAlert.title}
              onChangeText={(text) => setNewAlert({ ...newAlert, title: text })}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Mensaje de la alerta"
              value={newAlert.message}
              onChangeText={(text) => setNewAlert({ ...newAlert, message: text })}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                // En una implementación completa, aquí se abriría un DateTimePicker
                // Por ahora, usamos una fecha predeterminada
                RNAlert.alert(
                  'Seleccionar fecha',
                  'Funcionalidad de selector de fecha en desarrollo. Se usará la fecha actual.',
                  [{ text: 'OK' }]
                );
              }}
            >
              <Ionicons name="calendar" size={20} color="#007CF0" />
              <Text style={styles.dateButtonText}>
                {newAlert.date.toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>

            <View style={styles.typeSelector}>
              <Text style={styles.typeLabel}>Tipo de alerta:</Text>
              <View style={styles.typeButtons}>
                {['info', 'warning', 'error', 'success'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newAlert.type === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setNewAlert({ ...newAlert, type })}
                  >
                    <Ionicons
                      name={getAlertIcon(type)}
                      size={20}
                      color={newAlert.type === type ? '#fff' : '#666'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar Alerta</Text>
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
  alertCard: {
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
  alertCardPast: {
    opacity: 0.6,
    borderLeftColor: '#999',
  },
  alertCardRead: {
    backgroundColor: '#f9f9f9',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#007CF0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  alertMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertDate: {
    fontSize: 12,
    color: '#999',
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
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
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#007CF0',
    fontWeight: '500',
  },
  typeSelector: {
    marginBottom: 20,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007CF0',
    borderColor: '#007CF0',
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

