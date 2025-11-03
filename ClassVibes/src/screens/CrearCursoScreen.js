/**
 * Pantalla para Crear Curso
 * Formulario para crear nuevos cursos
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

export default function CrearCursoScreen({ navigation }) {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [curso, setCurso] = useState({
    idprofesor: '',
    nombre: '',
    precio: '',
    metodopago: '',
    materia: '',
    aniosecundaria: '',
    valoracion: '',
    cantalumnos: '',
    fotocurso: '',
    descripcion: '',
    videocurso: '',
  });

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = async () => {
    try {
      const { data } = await supabase.from('profesores').select('*');
      if (data) setProfesores(data);
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  };

  const handleChange = (field, value) => {
    setCurso({ ...curso, [field]: value });
  };

  const validarFormulario = () => {
    if (!curso.idprofesor) {
      Alert.alert('Error', 'Debe seleccionar un profesor');
      return false;
    }
    if (!curso.nombre.trim()) {
      Alert.alert('Error', 'El nombre del curso es obligatorio');
      return false;
    }
    if (isNaN(parseFloat(curso.precio))) {
      Alert.alert('Error', 'El precio debe ser un número');
      return false;
    }
    if (!curso.metodopago) {
      Alert.alert('Error', 'Debe seleccionar un método de pago');
      return false;
    }
    if (!curso.materia.trim()) {
      Alert.alert('Error', 'La materia es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const cursoFinal = { ...curso };
      delete cursoFinal.idcurso;

      const { error } = await supabase.from('cursos').insert([cursoFinal]);

      if (error) {
        Alert.alert('Error', 'No se pudo crear el curso');
        console.error(error);
      } else {
        Alert.alert('Éxito', 'Curso creado correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Crear Curso</Text>

      {/* ID Profesor */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Profesor *</Text>
        <View style={styles.pickerContainer}>
          {profesores.length > 0 ? (
            <ScrollView style={styles.pickerScroll}>
              {profesores.map((p) => (
                <TouchableOpacity
                  key={p.idprofesor}
                  style={[
                    styles.pickerOption,
                    curso.idprofesor === p.idprofesor.toString() &&
                      styles.pickerOptionSelected,
                  ]}
                  onPress={() =>
                    handleChange('idprofesor', p.idprofesor.toString())
                  }
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      curso.idprofesor === p.idprofesor.toString() &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {p.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>No hay profesores disponibles</Text>
          )}
        </View>
      </View>

      {/* Campos de texto */}
      {[
        ['nombre', 'Nombre del Curso *'],
        ['precio', 'Precio *'],
        ['materia', 'Materia *'],
        ['aniosecundaria', 'Año Secundaria'],
        ['valoracion', 'Valoración'],
        ['cantalumnos', 'Cantidad de Alumnos'],
        ['fotocurso', 'URL de la Foto'],
        ['videocurso', 'URL del Video'],
      ].map(([name, label]) => (
        <View key={name} style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            value={curso[name]}
            onChangeText={(value) => handleChange(name, value)}
            placeholder={`Ingrese ${label.toLowerCase()}`}
            keyboardType={
              ['precio', 'aniosecundaria', 'valoracion', 'cantalumnos'].includes(
                name
              )
                ? 'numeric'
                : 'default'
            }
          />
        </View>
      ))}

      {/* Método de pago */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Método de Pago *</Text>
        <View style={styles.pickerContainer}>
          {['Gratis', 'Pago'].map((metodo) => (
            <TouchableOpacity
              key={metodo}
              style={[
                styles.pickerOption,
                curso.metodopago === metodo && styles.pickerOptionSelected,
              ]}
              onPress={() => handleChange('metodopago', metodo)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  curso.metodopago === metodo &&
                    styles.pickerOptionTextSelected,
                ]}
              >
                {metodo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={curso.descripcion}
          onChangeText={(value) => handleChange('descripcion', value)}
          placeholder="Ingrese la descripción del curso"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Curso</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxHeight: 150,
  },
  pickerScroll: {
    maxHeight: 150,
  },
  pickerOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerOptionSelected: {
    backgroundColor: '#e3f2fd',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#007CF0',
    fontWeight: '600',
  },
  emptyText: {
    padding: 14,
    color: '#999',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007CF0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

