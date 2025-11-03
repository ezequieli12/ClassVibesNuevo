/**
 * ClassVibes - Aplicación móvil educativa
 * Trabajo Práctico Integrador Final
 * 
 * Funcionalidades implementadas:
 * - Location: Ubicación de cursos y profesores
 * - Alerts: Alertas y recordatorios para clases
 * - Notifications: Notificaciones push para eventos importantes
 * - Calendar: Calendario de clases y eventos académicos
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

// Pantallas principales
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminCursosScreen from './src/screens/AdminCursosScreen';
import CrearCursoScreen from './src/screens/CrearCursoScreen';

// Nuevas pantallas con funcionalidades requeridas
import LocationScreen from './src/screens/LocationScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import CalendarScreen from './src/screens/CalendarScreen';

// Servicios
import { registerForPushNotificationsAsync } from './src/services/notifications';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Navegación principal con Tabs
 * Incluye las 4 funcionalidades requeridas integradas de forma coherente
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Location') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'Alerts') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007CF0',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007CF0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ title: 'Calendario' }}
      />
      <Tab.Screen 
        name="Location" 
        component={LocationScreen}
        options={{ title: 'Ubicaciones' }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen}
        options={{ 
          title: 'Alertas',
          tabBarBadge: null, // Se puede actualizar dinámicamente
        }}
      />
      <Tab.Screen 
        name="Admin" 
        component={AdminCursosScreen}
        options={{ title: 'Admin' }}
      />
    </Tab.Navigator>
  );
}

/**
 * Componente principal de la aplicación
 */
export default function App() {
  useEffect(() => {
    // Registrar para notificaciones push al iniciar la app
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007CF0',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CrearCurso" 
          component={CrearCursoScreen}
          options={{ title: 'Crear Curso' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

