const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

// Función para registrar un usuario y asignar un perfil
const registrarUsuario = async (email, password, perfilId) => {
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .insert([{ email, password }])
    .single();

  if (usuarioError) {
    console.error('Error al registrar usuario:', usuarioError);
    return;
  }

  // Asignar el perfil al usuario en la tabla intermedia
  const { error: perfilError } = await supabase
    .from('usuario_perfil')
    .insert([{ usuario_id: usuario.id, perfil_id: perfilId }]);

  if (perfilError) {
    console.error('Error al asignar perfil:', perfilError);
  } else {
    console.log('Usuario registrado con perfil asignado');
  }
};

// Ejemplo de cómo llamar la función de registro
registrarUsuario('profesor@dominio.com', 'password123', 1); // 1 = Profesor
