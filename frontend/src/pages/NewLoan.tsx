import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { clientService } from '../services/clientService';
import { loanService } from '../services/loanService';

export default function NewLoan() {
  const navigate = useNavigate();

  // Client data
  const [dni, setDni] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [clientId, setClientId] = useState<number | null>(null);
  const [dniSource, setDniSource] = useState<'database' | 'reniec' | null>(null);

  // Loan data
  const [montoPrincipal, setMontoPrincipal] = useState('');
  const [interesAnual, setInteresAnual] = useState('');
  const [plazoEnDias, setPlazoEnDias] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchingDNI, setSearchingDNI] = useState(false);

  const handleSearchDNI = async () => {
    if (dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      return;
    }

    setSearchingDNI(true);
    setError('');

    try {
      const result = await clientService.getByDNI(dni);

      if (result.source === 'database') {
        // Cliente ya existe en la base de datos
        setClientId(result.data.id);
        setNombreCompleto(result.data.nombre_completo);
        setDniSource('database');
      } else if (result.source === 'reniec') {
        // Datos obtenidos de RENIEC
        setNombreCompleto(result.data.nombre_completo);
        setDniSource('reniec');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al consultar DNI');
    } finally {
      setSearchingDNI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Si el cliente no existe, crearlo primero
      let finalClientId = clientId;

      if (!finalClientId) {
        const newClient = await clientService.create(dni, nombreCompleto);
        finalClientId = newClient.id;
      }

      // Crear préstamo
      const loanData = await loanService.create({
        client_id: finalClientId,
        monto_principal: parseFloat(montoPrincipal),
        interes_anual_porcentaje: parseFloat(interesAnual),
        plazo_en_dias: parseInt(plazoEnDias),
      });

      // Redirigir a los detalles del préstamo
      navigate(`/loans/${loanData.loan.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear préstamo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Nuevo Préstamo</h1>

          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sección Cliente */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos del Cliente</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                      DNI (8 dígitos)
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        id="dni"
                        required
                        maxLength={8}
                        value={dni}
                        onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12345678"
                        disabled={!!clientId}
                      />
                      <button
                        type="button"
                        onClick={handleSearchDNI}
                        disabled={searchingDNI || dni.length !== 8 || !!clientId}
                        className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {searchingDNI ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>
                    {dniSource === 'database' && (
                      <p className="mt-1 text-sm text-green-600">Cliente encontrado en la base de datos</p>
                    )}
                    {dniSource === 'reniec' && (
                      <p className="mt-1 text-sm text-blue-600">Datos obtenidos de RENIEC</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="nombreCompleto"
                      required
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Juan Pérez García"
                      disabled={dniSource === 'database'}
                    />
                  </div>
                </div>
              </div>

              {/* Sección Préstamo */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos del Préstamo</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="montoPrincipal" className="block text-sm font-medium text-gray-700">
                      Monto Principal (S/)
                    </label>
                    <input
                      type="number"
                      id="montoPrincipal"
                      required
                      min="1"
                      step="0.01"
                      value={montoPrincipal}
                      onChange={(e) => setMontoPrincipal(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10000.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="interesAnual" className="block text-sm font-medium text-gray-700">
                      Tasa de Interés Anual (%)
                    </label>
                    <input
                      type="number"
                      id="interesAnual"
                      required
                      min="0"
                      max="100"
                      step="0.01"
                      value={interesAnual}
                      onChange={(e) => setInteresAnual(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="12.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="plazoEnDias" className="block text-sm font-medium text-gray-700">
                      Plazo en Días (múltiplo de 30)
                    </label>
                    <select
                      id="plazoEnDias"
                      required
                      value={plazoEnDias}
                      onChange={(e) => setPlazoEnDias(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      <option value="30">30 días (1 mes)</option>
                      <option value="60">60 días (2 meses)</option>
                      <option value="90">90 días (3 meses)</option>
                      <option value="120">120 días (4 meses)</option>
                      <option value="150">150 días (5 meses)</option>
                      <option value="180">180 días (6 meses)</option>
                      <option value="210">210 días (7 meses)</option>
                      <option value="240">240 días (8 meses)</option>
                      <option value="270">270 días (9 meses)</option>
                      <option value="300">300 días (10 meses)</option>
                      <option value="330">330 días (11 meses)</option>
                      <option value="360">360 días (12 meses)</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Préstamo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
