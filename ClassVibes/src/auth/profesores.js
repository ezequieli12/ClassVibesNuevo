const obtenerProfesores = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email')
      .eq('perfil_id', 1); // Perfil de Profesor
  
    if (error) {
      console.error('Error al obtener profesores:', error);
    } else {
      console.log('Profesores:', data);
    }
  };
  
  // Llamada a la función
  obtenerProfesores();
  