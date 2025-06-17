import React from 'react';
import { TokenCheckResult } from '../types';
import { XCircle, AlertTriangle, Mail } from 'lucide-react';

interface AccessDeniedProps {
  tokenInfo: TokenCheckResult;
  binId: string;
  clientName: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ tokenInfo, binId, clientName }) => {
  return (
    <section className="bg-white/95 dark:bg-slate-800/90 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8 max-w-2xl mx-auto text-center">
      <AlertTriangle size={48} className="mx-auto text-red-500 dark:text-red-400 mb-4" />
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">🚫 Acceso Restringido</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Lo sentimos, {clientName}, no tienes créditos suficientes para acceder al dashboard.
      </p>

      <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 dark:border-amber-700 text-amber-800 dark:text-amber-300 p-4 rounded-md shadow mb-6 text-left">
        <h3 className="font-bold mb-2 flex items-center"><XCircle size={20} className="mr-2"/>Estado de Créditos:</h3>
        <p><strong>Créditos Asignados:</strong> {tokenInfo.assignedTokens.toLocaleString()}</p>
        <p><strong>Créditos Utilizados:</strong> {tokenInfo.usedTokens.toLocaleString()}</p>
        <p className="font-semibold"><strong>Créditos Disponibles:</strong> {tokenInfo.availableTokens.toLocaleString()}</p>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Para continuar utilizando el servicio, necesitas solicitar más créditos.
      </p>

      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg shadow text-indigo-700 dark:text-indigo-300">
        <p className="font-semibold flex items-center justify-center"><Mail size={20} className="mr-2"/>Contacta al equipo de soporte:</p>
        <p className="mt-1">Por favor, proporciona tu ID de cliente al contactar: <strong className="font-mono">{binId}</strong></p>
        <a href="mailto:support@example.com?subject=Solicitud%20de%20Créditos%20-%20Dashboard" className="mt-2 inline-block bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
          Enviar Email de Soporte
        </a>
      </div>
    </section>
  );
};

export default AccessDenied;