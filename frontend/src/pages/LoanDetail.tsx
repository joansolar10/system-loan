import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loanService } from '../services/loanService';
import { Loan, Payment } from '../types';

export default function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadLoanData();
  }, [id]);

  const loadLoanData = async () => {
    if (!id) return;

    try {
      const [loanData, paymentsData] = await Promise.all([
        loanService.getById(parseInt(id)),
        loanService.getPayments(parseInt(id)),
      ]);

      setLoan(loanData);
      setPayments(paymentsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar datos del préstamo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadDDJJ = async () => {
    if (!id) return;

    setDownloading(true);
    try {
      await loanService.downloadDDJJ(parseInt(id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al descargar declaración jurada');
    } finally {
      setDownloading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `S/ ${numAmount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE');
  };

  const requiereDDJJ = loan && loan.monto_principal >= 5000;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando datos del préstamo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Préstamo no encontrado'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
              ← Volver a préstamos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Préstamo #{loan.id}</h1>
          </div>

          {/* Loan Summary */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen del Préstamo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="text-lg font-medium">{loan.nombre_completo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">DNI</p>
                <p className="text-lg font-medium">{loan.dni}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monto Principal</p>
                <p className="text-lg font-medium text-blue-600">{formatCurrency(loan.monto_principal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa de Interés Anual</p>
                <p className="text-lg font-medium">{loan.interes_anual_porcentaje}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Plazo</p>
                <p className="text-lg font-medium">{loan.plazo_en_dias} días</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cuota Mensual</p>
                <p className="text-lg font-medium text-green-600">{formatCurrency(loan.cuota_fija)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Entrega</p>
                <p className="text-lg font-medium">{formatDate(loan.fecha_entrega)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número de Cuotas</p>
                <p className="text-lg font-medium">{loan.plazo_en_dias / 30}</p>
              </div>
            </div>

            {requiereDDJJ && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Este préstamo requiere Declaración Jurada
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      El monto excede el umbral de S/ 5,000
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadDDJJ}
                    disabled={downloading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {downloading ? 'Descargando...' : 'Descargar DDJJ (PDF)'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Schedule */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cronograma de Pagos</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Vencimiento
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interés
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capital
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuota Total
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Restante
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className={payment.pagado ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.numero_cuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.fecha_vencimiento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(payment.interes_periodo)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(payment.capital_amortizado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {formatCurrency(payment.cuota_total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600 font-medium">
                        {formatCurrency(payment.saldo_restante)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900">
                      TOTALES
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                      {formatCurrency(payments.reduce((sum, p) => sum + p.interes_periodo, 0))}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                      {formatCurrency(payments.reduce((sum, p) => sum + p.capital_amortizado, 0))}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                      {formatCurrency(payments.reduce((sum, p) => sum + p.cuota_total, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
