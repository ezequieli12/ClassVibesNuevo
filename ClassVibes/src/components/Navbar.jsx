import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) setUsuario(JSON.parse(data));
  }, []);

  const handleUserClick = () => {
    if (usuario) {
      alert(`Perfil: ${usuario.nombre}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom bg-white">
      {/* Logo: lleva a Home */}
      <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        <img src="\assets\Logo.jpg" alt="ClassVibes" style={{ height: '45px' }} />
      </div>

      {/* Navegación + usuario + búsqueda */}
      <div className="d-flex align-items-center gap-3">
        {/* Botones verdes más chicos */}
        <div className="d-flex gap-2">
          <Link
            to="/"
            className="btn btn-success px-3 py-1 fw-bold"
            style={{ borderRadius: '0.5rem', color: 'black', fontSize: '14px' }}
          >
            Cursos
          </Link>
          <Link
            to="/"
            className="btn btn-success px-3 py-1 fw-bold"
            style={{ borderRadius: '0.5rem', color: 'black', fontSize: '14px' }}
          >
            Profesores
          </Link>
          <Link
            to="/admin"
            className="btn btn-success px-3 py-1 fw-bold"
            style={{ borderRadius: '0.5rem', color: 'black', fontSize: '14px' }}
          >
            Admin
          </Link>
        </div>

        {/* Ícono usuario + buscador */}
        <div className="d-flex align-items-center gap-2">
          <FaUserCircle size={28} onClick={handleUserClick} style={{ cursor: 'pointer' }} />
          <div className="d-flex align-items-center bg-light px-2 py-1 rounded-pill" style={{ width: '180px' }}>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder=""
              style={{ fontSize: '14px' }}
              disabled
            />
            <FaSearch className="ms-2" />
          </div>
        </div>
      </div>
    </nav>
  );
}
