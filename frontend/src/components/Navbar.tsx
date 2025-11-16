import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const admin = authService.getAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold">
              Sistema de Préstamos
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Inicio
              </Link>
              <Link
                to="/loans/new"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Nuevo Préstamo
              </Link>
              <Link
                to="/clients"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Clientes
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">{admin?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-blue-700 rounded-md hover:bg-blue-800"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
