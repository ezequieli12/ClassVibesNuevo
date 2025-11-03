# ClassVibes - Aplicación Móvil Educativa

## 📱 Trabajo Práctico Integrador Final
**Desarrollo de Aplicaciones Móviles con React Native + Expo**

---

## 📋 Descripción del Proyecto

ClassVibes es una aplicación móvil educativa desarrollada con React Native y Expo que permite a los estudiantes gestionar sus cursos, encontrar profesores cercanos, organizar su calendario académico y recibir alertas importantes. La aplicación integra cuatro funcionalidades principales requeridas para el trabajo práctico:

### 🎯 Funcionalidades Implementadas

#### 1. **Location (Ubicación)**
- Obtiene la ubicación actual del usuario mediante GPS
- Muestra cursos y profesores cercanos en un mapa interactivo
- Calcula distancias entre el usuario y los cursos disponibles
- Permite actualizar la ubicación manualmente
- Integración con `expo-location` y `react-native-maps`

**Archivos relacionados:**
- `src/screens/LocationScreen.js` - Pantalla principal de ubicaciones
- `src/services/location.js` - Servicio de gestión de ubicación

**Concepto:** Permite a los estudiantes encontrar cursos y profesores cerca de su ubicación actual.

#### 2. **Alerts (Alertas)**
- Sistema completo de gestión de alertas y recordatorios
- Creación de alertas personalizadas con título, mensaje, fecha y tipo
- Clasificación de alertas por tipo (info, warning, error, success)
- Marcado de alertas como leídas/no leídas
- Eliminación de alertas
- Integración con notificaciones push para recordatorios
- Persistencia de datos con AsyncStorage

**Archivos relacionados:**
- `src/screens/AlertsScreen.js` - Pantalla de gestión de alertas
- `src/services/alerts.js` - Servicio de gestión de alertas

**Concepto:** Los estudiantes pueden crear alertas para recordar fechas importantes, exámenes, entregas de trabajos, etc.

#### 3. **Notifications (Notificaciones Push)**
- Registro de dispositivo para recibir notificaciones push
- Programación de notificaciones locales
- Notificaciones automáticas cuando se crean eventos en el calendario
- Notificaciones para alertas programadas
- Configuración de canales de notificación para Android
- Manejo de permisos de notificaciones

**Archivos relacionados:**
- `src/services/notifications.js` - Servicio de notificaciones
- Integrado en `App.js` para registro inicial
- Usado en `CalendarScreen.js` y `AlertsScreen.js`

**Concepto:** Los estudiantes reciben notificaciones cuando hay eventos importantes en su calendario o alertas programadas.

#### 4. **Calendar (Calendario)**
- Integración con el calendario nativo del dispositivo
- Creación de eventos en el calendario del dispositivo
- Visualización de eventos programados por fecha
- Obtención de eventos existentes del calendario
- Programación de alarmas automáticas (15 minutos antes)
- Interfaz para seleccionar fechas y crear eventos
- Notificaciones automáticas al crear eventos

**Archivos relacionados:**
- `src/screens/CalendarScreen.js` - Pantalla de calendario
- `src/services/calendar.js` - Servicio de gestión de calendario

**Concepto:** Los estudiantes pueden crear eventos de clases en su calendario nativo, con recordatorios automáticos.

---

## 🏗️ Arquitectura y Estructura del Proyecto

### Estructura de Carpetas

```
ClassVibes/
├── App.js                    # Componente principal y navegación
├── app.json                  # Configuración de Expo
├── package.json              # Dependencias del proyecto
├── src/
│   ├── screens/             # Pantallas de la aplicación
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── AdminCursosScreen.js
│   │   ├── CrearCursoScreen.js
│   │   ├── LocationScreen.js      # Funcionalidad Location
│   │   ├── AlertsScreen.js         # Funcionalidad Alerts
│   │   └── CalendarScreen.js       # Funcionalidad Calendar
│   └── services/            # Servicios y lógica de negocio
│       ├── supabase.js      # Conexión a Supabase
│       ├── location.js      # Servicio de Location
│       ├── alerts.js        # Servicio de Alerts
│       ├── notifications.js # Servicio de Notifications
│       └── calendar.js      # Servicio de Calendar
└── README.md                # Este archivo
```

### Navegación

La aplicación utiliza **React Navigation** con una estructura híbrida:

1. **Stack Navigator Principal:**
   - Pantalla de Login (sin header)
   - Navegación principal con Tabs

2. **Bottom Tab Navigator:**
   - **Home**: Pantalla principal con reseñas
   - **Calendar**: Gestión de eventos del calendario
   - **Location**: Mapa con cursos cercanos
   - **Alerts**: Gestión de alertas
   - **Admin**: Administración de cursos

3. **Stack de Admin:**
   - CrearCursoScreen (navegable desde Admin)

### Integración entre Funcionalidades

Las 4 funcionalidades están conectadas conceptualmente:

1. **Location ↔ Calendar:** Los cursos cercanos pueden convertirse en eventos del calendario
2. **Calendar ↔ Notifications:** Los eventos creados generan notificaciones automáticas
3. **Alerts ↔ Notifications:** Las alertas programadas generan notificaciones push
4. **Calendar ↔ Alerts:** Los eventos pueden generar alertas para recordatorios

---

## 🛠️ Tecnologías Utilizadas

### Core
- **React Native** 0.73.2
- **Expo SDK** ~50.0.0
- **React** 18.2.0

### Navegación
- **@react-navigation/native** ^6.1.9
- **@react-navigation/bottom-tabs** ^6.5.11
- **@react-navigation/stack** ^6.3.20

### Funcionalidades Requeridas
- **expo-location** ~16.5.5 - Para obtener ubicación GPS
- **expo-notifications** ~0.27.6 - Para notificaciones push
- **expo-calendar** ~12.8.0 - Para integración con calendario nativo
- **react-native-maps** 1.10.0 - Para mostrar mapas

### Almacenamiento y Backend
- **@react-native-async-storage/async-storage** ^1.21.0 - Almacenamiento local
- **@supabase/supabase-js** ^2.50.5 - Backend y base de datos

### UI/UX
- **@expo/vector-icons** ^14.0.0 - Iconos
- **react-native-safe-area-context** 4.8.2 - Manejo de áreas seguras
- **react-native-gesture-handler** ~2.14.0 - Gestos

---

## 🚀 Instalación y Configuración

### Prerrequisitos

1. Node.js (versión 18 o superior)
2. Expo CLI instalado globalmente: `npm install -g expo-cli`
3. Expo Go instalado en tu dispositivo móvil (iOS o Android)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor de desarrollo:**
```bash
npm start
# o
expo start
```

4. **Ejecutar en dispositivo:**
   - Escanear el código QR con Expo Go (iOS) o la app de cámara (Android)
   - O ejecutar `npm run android` / `npm run ios` con emuladores configurados

### Configuración de Permisos

La aplicación requiere los siguientes permisos:

- **Ubicación**: Para mostrar cursos cercanos
- **Calendario**: Para crear y leer eventos
- **Notificaciones**: Para enviar recordatorios

Estos permisos se solicitan automáticamente cuando se accede a cada funcionalidad por primera vez.

---

## 📱 Uso de la Aplicación

### Login
- Ingresar con usuario y contraseña (almacenados en Supabase)
- Los datos de sesión se guardan en AsyncStorage

### Home
- Visualización de reseñas de estudiantes
- Botones de acceso rápido a Calendar y Location

### Calendar (Funcionalidad 1)
1. Seleccionar una fecha usando los controles de navegación
2. Tocar el botón "+" para crear un nuevo evento
3. Completar título, descripción y hora
4. El evento se guarda en el calendario nativo del dispositivo
5. Se programa una notificación automática

### Location (Funcionalidad 2)
1. La app solicita permisos de ubicación
2. Muestra el mapa con la ubicación actual del usuario
3. Los cursos cercanos aparecen como marcadores en el mapa
4. Tocar un marcador muestra información del curso
5. La lista inferior muestra los 5 cursos más cercanos con distancias

### Alerts (Funcionalidad 3)
1. Tocar el botón "+" para crear una alerta
2. Completar título, mensaje, fecha y tipo
3. Las alertas se guardan localmente
4. Las alertas programadas generan notificaciones push
5. Marcar alertas como leídas o eliminarlas

### Admin
- Visualizar lista de cursos
- Crear nuevos cursos
- Eliminar cursos existentes
- Editar cursos (funcionalidad en desarrollo)

---

## 🎨 Diseño UI/UX

### Paleta de Colores
- **Primario**: #007CF0 (Azul)
- **Secundario**: #00DFD8 (Cyan)
- **Éxito**: #4caf50 (Verde)
- **Advertencia**: #ff9800 (Naranja)
- **Error**: #f44336 (Rojo)
- **Fondo**: #f4f4f4 (Gris claro)

### Características de Diseño
- Diseño consistente con esquema de colores unificado
- Iconos de Ionicons para mejor UX
- Navegación intuitiva con tabs bottom
- Cards con sombras para profundidad
- Badges y estados visuales claros
- Estados vacíos informativos
- Modales para creación de contenido
- Feedback visual en todas las acciones

---

## 💻 Aspectos Técnicos para la Defensa

### Hooks Utilizados

#### useState
- Estado local de componentes
- Gestión de formularios
- Control de modales y visibilidad

#### useEffect
- Carga de datos al montar componentes
- Suscripciones a eventos
- Registro de notificaciones

### Manejo de Permisos

Cada funcionalidad maneja sus propios permisos:

```javascript
// Location
const { status } = await Location.requestForegroundPermissionsAsync();

// Calendar
const { status } = await Calendar.requestCalendarPermissionsAsync();

// Notifications
const { status } = await Notifications.getPermissionsAsync();
```

### AsyncStorage

Almacenamiento local para:
- Datos de sesión de usuario
- Alertas creadas por el usuario
- Tokens de notificación

### Servicios

Cada funcionalidad tiene su propio servicio que encapsula:
- Lógica de negocio
- Manejo de permisos
- Comunicación con APIs nativas
- Manejo de errores

### Integración con APIs Nativas

- **expo-location**: APIs nativas de GPS
- **expo-calendar**: Integración con calendario del SO
- **expo-notifications**: Sistema de notificaciones del SO

---

## 📝 Funcionalidades Técnicas Destacadas

### 1. Location Service
- **Cálculo de distancias**: Implementación del algoritmo Haversine
- **Permisos dinámicos**: Solicitud solo cuando es necesario
- **Actualización manual**: Botón para refrescar ubicación

### 2. Alerts Service
- **Persistencia local**: AsyncStorage para guardar alertas
- **Tipos de alertas**: Sistema de categorización visual
- **Estado de lectura**: Marcado de alertas como leídas
- **Notificaciones programadas**: Integración automática con notificaciones

### 3. Notifications Service
- **Registro de dispositivo**: Obtención de token único
- **Canales de Android**: Configuración de canales de notificación
- **Programación**: Notificaciones locales programadas
- **Persistencia de token**: Guardado para uso posterior

### 4. Calendar Service
- **Integración nativa**: Eventos en calendario del dispositivo
- **Alarmas automáticas**: Recordatorios 15 minutos antes
- **Rangos de fechas**: Consulta de eventos en períodos específicos
- **Filtrado de calendarios**: Solo calendarios modificables

---

## 🧪 Casos de Uso y Flujos

### Caso 1: Estudiante crea un evento de clase
1. Abre la app → Calendario
2. Selecciona fecha
3. Toca "+" para crear evento
4. Completa formulario
5. Guarda → Evento creado en calendario nativo
6. Notificación programada automáticamente

### Caso 2: Estudiante busca cursos cercanos
1. Abre la app → Location
2. App solicita permiso de ubicación
3. Muestra mapa con ubicación actual
4. Cursos cercanos aparecen en mapa y lista
5. Toca curso para ver detalles

### Caso 3: Estudiante crea alerta de examen
1. Abre la app → Alerts
2. Toca "+" para crear alerta
3. Completa: "Examen Matemática", fecha/hora, tipo "warning"
4. Guarda alerta
5. Al llegar la fecha, recibe notificación push

### Caso 4: Integración completa
1. Estudiante ve curso cercano en Location
2. Crea evento en Calendar para clase de ese curso
3. Crea alerta para recordatorio de tarea
4. Recibe notificación cuando llega la fecha

---

## 🔑 Puntos Clave para la Defensa

### 1. Arquitectura
- Separación de responsabilidades (screens vs services)
- Componentes reutilizables
- Manejo centralizado de permisos
- Servicios modulares y testables

### 2. Integración de Funcionalidades
- No son módulos aislados
- Location alimenta información a Calendar
- Calendar genera Notifications
- Alerts se integran con Notifications
- Flujo coherente de usuario

### 3. Navegación
- React Navigation implementado correctamente
- Stack Navigator para Login/Main
- Bottom Tabs para navegación principal
- Navegación contextual (Stack dentro de Tabs)

### 4. UX/UI
- Diseño consistente
- Feedback visual en todas las acciones
- Estados de carga
- Mensajes de error claros
- Estados vacíos informativos

### 5. Código
- Comentarios explicativos
- Nombre de variables descriptivos
- Manejo de errores
- Validaciones de formularios
- Estructura organizada en carpetas

---

## 📚 Dependencias Principales Explicadas

### @react-navigation/native
- Navegación principal de la app
- Wrapper que permite usar diferentes tipos de navegación

### @react-navigation/bottom-tabs
- Navegación por tabs en la parte inferior
- Iconos y badges configurables

### @react-navigation/stack
- Navegación tipo pila (push/pop)
- Headers configurables

### expo-location
- Acceso a GPS del dispositivo
- Permisos de ubicación
- Cálculo de coordenadas

### expo-notifications
- Sistema de notificaciones push
- Notificaciones locales programadas
- Manejo de tokens

### expo-calendar
- Integración con calendario nativo
- Creación y lectura de eventos
- Permisos de calendario

### react-native-maps
- Componente de mapa interactivo
- Marcadores personalizados
- Integración con ubicación

### @react-native-async-storage/async-storage
- Almacenamiento local asíncrono
- Persistencia de datos
- API key-value simple

---

## ⚠️ Consideraciones y Limitaciones

### Permisos
- La app requiere permisos explícitos del usuario
- Sin permisos, las funcionalidades no funcionan
- Se solicitan solo cuando son necesarios

### Dispositivos Físicos
- Notificaciones push requieren dispositivo físico
- Algunas funcionalidades pueden no funcionar en emuladores

### Base de Datos
- La app usa Supabase como backend
- Requiere conexión a internet para cargar cursos
- Alertas y eventos se guardan localmente

### Calendario
- Integración con calendario nativo del dispositivo
- Los eventos se crean en el calendario por defecto
- Requiere permisos de escritura en calendario

---

## 🎯 Cómo Explicar Cada Funcionalidad

### Location
1. **¿Qué hace?** Obtiene la ubicación GPS del usuario y muestra cursos cercanos en un mapa
2. **¿Cómo funciona?** Usa `expo-location` para obtener coordenadas y `react-native-maps` para mostrar el mapa
3. **¿Dónde está el código?** `LocationScreen.js` y `location.js`
4. **Puntos clave:** Permisos, cálculo de distancias (Haversine), marcadores en mapa

### Alerts
1. **¿Qué hace?** Permite crear, ver, editar y eliminar alertas personales
2. **¿Cómo funciona?** Usa AsyncStorage para persistir datos localmente
3. **¿Dónde está el código?** `AlertsScreen.js` y `alerts.js`
4. **Puntos clave:** AsyncStorage, integración con notificaciones, tipos de alertas

### Notifications
1. **¿Qué hace?** Registra el dispositivo para recibir notificaciones y programa notificaciones locales
2. **¿Cómo funciona?** Usa `expo-notifications` para manejar el sistema de notificaciones del SO
3. **¿Dónde está el código?** `notifications.js`, integrado en `App.js` y otras pantallas
4. **Puntos clave:** Registro de token, canales Android, programación de notificaciones

### Calendar
1. **¿Qué hace?** Integra con el calendario nativo para crear y leer eventos
2. **¿Cómo funciona?** Usa `expo-calendar` para acceder a APIs nativas del calendario
3. **¿Dónde está el código?** `CalendarScreen.js` y `calendar.js`
4. **Puntos clave:** Permisos de calendario, creación de eventos, alarmas automáticas

---

## 📋 Checklist para la Defensa

### Funcionalidad (40%)
- [x] Location implementada y funcionando
- [x] Alerts implementada y funcionando
- [x] Notifications implementada y funcionando
- [x] Calendar implementada y funcionando

### Integración (15%)
- [x] Las 4 funcionalidades están relacionadas conceptualmente
- [x] Las funcionalidades interactúan entre sí
- [x] No son módulos aislados

### Navegación (15%)
- [x] React Navigation implementado
- [x] Estructura de navegación coherente
- [x] Bottom tabs funcionando
- [x] Stack navigation para flujos específicos

### Diseño (20%)
- [x] UI/UX consistente
- [x] Colores y tipografías coherentes
- [x] Iconos apropiados
- [x] Estados visuales claros

### Código (10%)
- [x] Código organizado en carpetas
- [x] Componentes reutilizables
- [x] Comentarios en partes principales
- [x] Código limpio y legible

---

## 🎓 Preguntas Frecuentes para la Defensa

### ¿Por qué elegiste estas 4 funcionalidades?
**Respuesta:** Son funcionalidades complementarias en una app educativa:
- **Location**: Encontrar cursos cercanos
- **Alerts**: Recordar eventos importantes
- **Notifications**: Recordatorios automáticos
- **Calendar**: Organizar clases y eventos

### ¿Cómo se integran las funcionalidades?
**Respuesta:** 
- Location muestra cursos → Pueden convertirse en eventos de Calendar
- Calendar crea eventos → Genera Notifications automáticas
- Alerts programadas → Generan Notifications push
- Todo forma un ecosistema educativo completo

### ¿Por qué usaste AsyncStorage para alerts?
**Respuesta:** Las alertas son datos personales del usuario que no necesitan sincronización con servidor. AsyncStorage es perfecto para datos locales que persisten entre sesiones.

### ¿Cómo funcionan las notificaciones push?
**Respuesta:** 
1. La app solicita permisos al iniciar
2. Se obtiene un token único del dispositivo
3. Las notificaciones pueden ser locales (programadas) o remotas (servidor)
4. En este proyecto usamos notificaciones locales programadas

### ¿Qué hace el servicio de location?
**Respuesta:** 
1. Solicita permisos de ubicación
2. Obtiene coordenadas GPS actuales
3. Calcula distancias usando fórmula Haversine
4. Devuelve ubicación para usar en mapas

---

## 📞 Información del Proyecto

**Temática:** Aplicación educativa móvil

**Funcionalidades implementadas:**
1. Location - Ubicación GPS y mapas
2. Alerts - Sistema de alertas y recordatorios
3. Notifications - Notificaciones push
4. Calendar - Integración con calendario nativo

**Tecnologías:** React Native, Expo, React Navigation, Supabase

**Integrantes:** [Agregar nombres]

---

## 🚧 Posibles Mejoras Futuras

- Implementar selector de fecha/hora más completo para Alerts
- Agregar más detalles en los marcadores del mapa
- Sincronizar alertas con servidor
- Agregar filtros en la vista de Location
- Mejorar la vista de calendario con componente visual más completo
- Agregar edición de eventos del calendario
- Implementar búsqueda de cursos

---

## 📄 Licencia

Este proyecto fue desarrollado como trabajo práctico académico.

---

**¡Éxito en tu defensa!** 🎉
