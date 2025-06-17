import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
  size?: number;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = "Cargando datos...", size = 32, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 text-slate-600 dark:text-slate-400 ${className}`}>
      <Loader2 className="animate-spin text-indigo-500 dark:text-indigo-400" size={size} />
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
};

export default LoadingIndicator;