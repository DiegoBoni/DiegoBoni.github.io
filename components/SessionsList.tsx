import React from 'react';
import { ChatSession } from '../types';
import SessionItem from './SessionItem';
import { Download } from 'lucide-react';
import { downloadFile, formatAllSessionsToCsv } from '../utils';


interface SessionsListProps {
  sessions: ChatSession[];
  clientName: string;
}

const SessionsList: React.FC<SessionsListProps> = ({ sessions, clientName }) => {
  if (!sessions || sessions.length === 0) {
    return <div className="text-center py-8 text-slate-500 dark:text-slate-400">No hay sesiones para mostrar.</div>;
  }

  const handleDownloadAllSessions = () => {
    const csvContent = formatAllSessionsToCsv(sessions);
    downloadFile(csvContent, `todas_sesiones_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8');
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-xl rounded-xl p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">📝 Historial de Sesiones</h3>
        <button
          onClick={handleDownloadAllSessions}
          className="flex items-center bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150 ease-in-out text-sm"
          aria-label="Descargar todas las sesiones como CSV"
        >
          <Download size={16} className="mr-2" />
          Descargar Todo (CSV)
        </button>
      </div>
      <div>
        {sessions.map((session, index) => (
          <SessionItem key={session.sessionId || `session-${index}`} session={session} sessionNumber={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default SessionsList;