import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminCursos() {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  const cargarCursos = async () => {
    const { data, error } = await supabase.from('cursos').select('*');
    if (!error) setCursos(data);
  };

  const handleEliminar = async (idcurso) => {
    if (confirm('¿Estás seguro de que querés eliminar este curso?')) {
      const { error } = await supabase.from('cursos').delete().eq('idcurso', idcurso);
      if (!error) cargarCursos();
    }
  };

  const handleEditar = (idcurso) => {
    alert(`Funcionalidad de edición aún no implementada. ID: ${idcurso}`);
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  return (
    <div className="container py-5" style={{ backgroundColor: '#f4f4f4' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Lista de Cursos</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/crear-curso')}>
          Crear Nuevo Curso
        </button>
      </div>

      <table className="table table-bordered table-hover text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th style={{ width: '180px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.idcurso}>
              <td>{curso.nombre}</td>
              <td>${curso.precio}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-warning btn-sm" onClick={() => handleEditar(curso.idcurso)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(curso.idcurso)}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
          {cursos.length === 0 && (
            <tr>
              <td colSpan="3">No hay cursos cargados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
