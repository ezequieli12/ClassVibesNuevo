import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminCursos from './pages/AdminCursos';
import CrearCurso from './pages/CrearCurso';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminCursos />} />
        <Route path="/admin/crear-curso" element={<CrearCurso />} />
      </Routes>
      <Footer />
    </>
  );
}
