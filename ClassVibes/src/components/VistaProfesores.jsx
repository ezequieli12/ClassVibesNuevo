import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conectar a Supabase
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const VistaProfesores = () => {
  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    const obtenerProfesores = async () => {
      // Obtener todos los usuarios con perfil de Profesor
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, email')
        .eq('perfil_id', 1); // Perfil de Profesor

      if (error) {
        console.error('Error al obtener profesores:', error);
      } else {
        setProfesores(data);
      }
    };

    obtenerProfesores();
  }, []);

  return (
    <div>
      <h1>Profesores</h1>
      {profesores.length > 0 ? (
        profesores.map((profesor) => (
          <div key={profesor.id}>
            <p>{profesor.email}</p>
          </div>
        ))
      ) : (
        <p>No se encontraron profesores.</p>
      )}
    </div>
  );
};

export default VistaProfesores;
