import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const AuthForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [perfilId, setPerfilId] = useState(2); // Por defecto, asignar Alumno

  // Función de registro de usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ email, password }])
      .single();

    if (error) {
      console.error('Error al registrar:', error);
      return;
    }

    const { error: perfilError } = await supabase
      .from('usuario_perfil')
      .insert([{ usuario_id: data.id, perfil_id: perfilId }]);

    if (perfilError) {
      console.error('Error al asignar perfil:', perfilError);
    } else {
      console.log('Usuario registrado y perfil asignado');
    }
  };

  // Función de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error) {
      console.error('Error al iniciar sesión:', error);
      return;
    }

    // Obtener el perfil del usuario
    const { data: perfil, error: perfilError } = await supabase
      .from('usuario_perfil')
      .select('perfil_id')
      .eq('usuario_id', data.id)
      .single();

    if (perfilError) {
      console.error('Error al obtener el perfil:', perfilError);
      return;
    }

    // Determinar el tipo de perfil
    switch (perfil.perfil_id) {
      case 1:
        console.log('Bienvenido, Profesor');
        break;
      case 2:
        console.log('Bienvenido, Alumno');
        break;
      case 3:
        console.log('Bienvenido, Admin');
        break;
      default:
        console.log('Perfil no reconocido');
    }
  };

  return (
    <div>
      <h1>{isRegistering ? 'Registro' : 'Inicio de sesión'}</h1>

      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Si es registro, mostrar selección de perfil */}
        {isRegistering && (
          <div>
            <label>
              <input
                type="radio"
                value={2}
                checked={perfilId === 2}
                onChange={() => setPerfilId(2)}
              />
              Alumno
            </label>
            <label>
              <input
                type="radio"
                value={1}
                checked={perfilId === 1}
                onChange={() => setPerfilId(1)}
              />
              Profesor
            </label>
            <label>
              <input
                type="radio"
                value={3}
                checked={perfilId === 3}
                onChange={() => setPerfilId(3)}
              />
              Admin
            </label>
          </div>
        )}

        <button type="submit">{isRegistering ? 'Registrar' : 'Iniciar sesión'}</button>
      </form>

      {/* Botón para alternar entre registro e inicio de sesión */}
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
};

export default AuthForm;
