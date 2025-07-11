import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function CrearCurso() {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState([]);
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
    videocurso: ''
  });

  useEffect(() => {
    async function cargarProfesores() {
      const { data } = await supabase.from('profesores').select('*');
      if (data) setProfesores(data);
    }
    cargarProfesores();
  }, []);

  const handleChange = (e) => {
    setCurso({ ...curso, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!curso.idprofesor) return alert("Debe seleccionar un profesor.");
    if (!curso.nombre.trim()) return alert("El nombre del curso es obligatorio.");
    if (isNaN(parseFloat(curso.precio))) return alert("El precio debe ser un número.");
    if (!curso.metodopago) return alert("Debe seleccionar un método de pago.");
    if (!curso.materia.trim()) return alert("La materia es obligatoria.");
    if (!curso.aniosecundaria || isNaN(curso.aniosecundaria)) return alert("El año debe ser un número.");
    if (!curso.valoracion || isNaN(curso.valoracion)) return alert("La valoración debe ser un número.");
    if (!curso.cantalumnos || isNaN(curso.cantalumnos)) return alert("La cantidad de alumnos debe ser un número.");
    if (!curso.fotocurso.trim()) return alert("Debe ingresar la URL de la foto.");
    if (!curso.descripcion.trim()) return alert("La descripción es obligatoria.");
    if (!curso.videocurso.trim()) return alert("Debe ingresar la URL del video.");

    // Prevención final: eliminar cualquier posible idcurso del objeto
    const cursoFinal = { ...curso };
    delete cursoFinal.idcurso;

    console.log("⏳ Enviando a Supabase:", cursoFinal);

    const { error } = await supabase.from('cursos').insert([cursoFinal]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      alert('Error al crear el curso. Revisa la consola para más información.');
    } else {
      alert('Curso creado correctamente');
      navigate('/admin');
    }
  };

  const handleCancel = () => navigate('/admin');

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 fw-bold">Crear Curso</h2>
      <form onSubmit={handleSubmit}>
        {/* ID Profesor */}
        <div className="mb-3">
          <label>ID Profesor</label>
          <select
            name="idprofesor"
            className="form-control"
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((p) => (
              <option key={p.idprofesor} value={p.idprofesor}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campos de texto */}
        {[
          ['nombre', 'Nombre'],
          ['precio', 'Precio'],
          ['materia', 'Materia'],
          ['aniosecundaria', 'Año Secundaria'],
          ['valoracion', 'Valoración'],
          ['cantalumnos', 'Cantidad de Alumnos'],
          ['fotocurso', 'Foto del Curso (URL)'],
          ['videocurso', 'Video del Curso (URL)']
        ].map(([name, label]) => (
          <div className="mb-3" key={name}>
            <label>{label}</label>
            <input
              type={['aniosecundaria', 'cantalumnos'].includes(name) ? 'number' : 'text'}
              className="form-control"
              name={name}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Método de pago */}
        <div className="mb-3">
          <label>Método de Pago</label>
          <select
            name="metodopago"
            className="form-control"
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un método</option>
            <option value="Gratis">Gratis</option>
            <option value="Pago">Pago</option>
          </select>
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label>Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            rows="3"
            onChange={handleChange}
            required
          />
        </div>

        {/* Botones */}
        <button type="submit" className="btn btn-primary me-2">
          Guardar Cambios
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
}
