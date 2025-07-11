import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ userName: '', contraseña: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('USUARIO')
      .select('*')
      .eq('userName', form.userName)
      .eq('contraseña', form.contraseña)
      .single();

    if (data) {
      localStorage.setItem('usuario', JSON.stringify(data));
      navigate('/admin');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f4f4f4' }}>
      <div className="text-center w-100" style={{ maxWidth: '400px' }}>
        <h2 className="mb-4" style={{ fontWeight: 'bold' }}>Iniciar Sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="border rounded shadow-sm p-4" style={{ borderColor: '#007CF0', borderWidth: '1px' }}>
          <div className="mb-3 text-start">
            <label className="form-label fw-bold">Nombre de usuario</label>
            <input
              type="text"
              name="userName"
              className="form-control bg-light"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 text-start">
            <label className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              className="form-control bg-light"
              value={form.contraseña}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}
