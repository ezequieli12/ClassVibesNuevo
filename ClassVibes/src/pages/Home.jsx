import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const [resenas, setResenas] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function cargarResenas() {
      const { data, error } = await supabase
        .from('RESEÑAS')
        .select('texto, idAlumno, USUARIO(nombre, fotoPerfil)')
        .limit(10)
        .order('idResena', { ascending: true })
        .select(`
          texto,
          idAlumno,
          USUARIO (
            nombre,
            fotoPerfil
          )
        `);
      if (!error) setResenas(data);
    }
    cargarResenas();
  }, []);

  const avanzar = () => {
    if (index < resenas.length - 3) setIndex(index + 1);
  };

  const retroceder = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div>
      {/* SECCIÓN DEGRADADO */}
      <div
        className="text-center py-5"
        style={{
          background: 'linear-gradient(90deg, #007CF0 0%, #00DFD8 100%)',
          color: 'black',
          fontWeight: 'bold',
          fontSize: '2rem',
        }}
      >
        Cambiando el mundo,<br />una mente a la vez.
      </div>

      {/* SECCIÓN RESEÑAS */}
      <div className="container py-5">
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-success me-3" onClick={retroceder}>
            <FaArrowLeft />
          </button>

          <div className="d-flex flex-row flex-wrap justify-content-center w-100 gap-4">
            {resenas.slice(index, index + 3).map((r, i) => (
              <div
                key={i}
                className="card p-3"
                style={{ width: '18rem', borderColor: '#007CF0', borderWidth: '1px' }}
              >
                <div className="d-flex align-items-center mb-2">
                  <img
                    src={r.USUARIO?.fotoPerfil || 'https://via.placeholder.com/50'}
                    alt="perfil"
                    className="rounded-circle me-2"
                    width="50"
                    height="50"
                  />
                  <strong>{r.USUARIO?.nombre || 'Usuario'}</strong>
                </div>
                <p className="mb-0 text-muted">"{r.texto.slice(0, 120)}..."</p>
              </div>
            ))}
          </div>

          <button className="btn btn-outline-success ms-3" onClick={avanzar}>
            <FaArrowRight />
          </button>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-success">Ver reseñas</button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center py-3 bg-light border-top">
        Copyright © 2024 ClassVibes
      </div>
    </div>
  );
}
