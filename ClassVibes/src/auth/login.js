const iniciarSesion = async (email, password) => {
    const { data: usuario, error: loginError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .eq('password', password)
      .single();
  
    if (loginError) {
      console.error('Error al iniciar sesión:', loginError);
      return;
    }
  
    // Obtener el perfil del usuario
    const { data: perfil, error: perfilError } = await supabase
      .from('usuario_perfil')
      .select('perfil_id')
      .eq('usuario_id', usuario.id)
      .single();
  
    if (perfilError) {
      console.error('Error al obtener el perfil:', perfilError);
      return;
    }
  
    // Determinar el tipo de perfil y mostrar la vista correspondiente
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
  
  // Ejemplo de cómo llamar la función de inicio de sesión
  iniciarSesion('profesor@dominio.com', 'password123');
  