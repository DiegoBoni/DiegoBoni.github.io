import React, { useState, useEffect } from 'react';
import { KeyRound, LogIn } from 'lucide-react';
import LoadingIndicator from './LoadingIndicator';

interface LoginSectionProps {
  onLoadData: (binId: string) => void;
  initialBinId: string;
  isLoading: boolean;
  error: string | null;
}

const LoginSection: React.FC<LoginSectionProps> = ({ onLoadData, initialBinId, isLoading, error }) => {
  const [binId, setBinId] = useState(initialBinId);

  useEffect(() => {
    setBinId(initialBinId);
  }, [initialBinId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (binId.trim()) {
      onLoadData(binId.trim());
    }
  };

  return (
    <section className="bg-white/95 dark:bg-slate-800/90 backdrop-blur-md shadow-2xl rounded-xl p-6 md:p-8 max-w-lg mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="binId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            ID del Cliente
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="binId"
              value={binId}
              onChange={(e) => setBinId(e.target.value)}
              placeholder="Ej: 675878a1acd3cb34a8b8f2c8"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !binId.trim()}
          className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <LogIn size={20} className="mr-2 animate-pulse" />
          ) : (
            <LogIn size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
          )}
          Cargar Dashboard
        </button>
      </form>

      {isLoading && <LoadingIndicator message="Cargando datos..." className="mt-6" />}
      
      {error && (
        <div className="mt-6 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded-md shadow" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </section>
  );
};

export default LoginSection;