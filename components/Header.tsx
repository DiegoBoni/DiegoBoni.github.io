import React from 'react';
import { LogOut, RefreshCw, BarChart3, Sun, Moon } from 'lucide-react';
import { AppView } from '../types';

type Theme = 'light' | 'dark';

interface HeaderProps {
  title: string;
  subtitle: string;
  currentView: AppView;
  onLogout: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, currentView, onLogout, onRefresh, isLoading, theme, onToggleTheme }) => {
  const showDashboardControls = currentView === AppView.Dashboard || currentView === AppView.AccessDenied;

  const buttonBaseStyle = "flex items-center font-semibold py-2 px-3 md:px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base";
  const adaptiveButtonStyle = `${buttonBaseStyle} bg-black/5 hover:bg-black/10 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600`;
  const logoutButtonStyle = `${buttonBaseStyle} bg-rose-500 hover:bg-rose-600 text-white focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-400`;
  const themeToggleButtonStyle = `${buttonBaseStyle} bg-black/5 hover:bg-black/10 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600`;


  return (
    <header className="py-6 px-4 md:px-0 mb-8 relative">
      <div className="flex items-center mb-1">
        <BarChart3 size={40} className="mr-3 text-indigo-600 dark:text-indigo-400 transition-colors duration-300" />
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-slate-700 dark:text-slate-200 transition-colors duration-300">{title}</h1>
          <p className="text-indigo-600 dark:text-indigo-400 text-sm md:text-base transition-colors duration-300">{subtitle}</p>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 md:top-6 md:right-0 flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onToggleTheme}
          className={themeToggleButtonStyle}
          aria-label={theme === 'light' ? "Activar modo oscuro" : "Activar modo claro"}
          title={theme === 'light' ? "Activar modo oscuro" : "Activar modo claro"}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        {showDashboardControls && (
          <>
            {currentView === AppView.Dashboard && onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className={adaptiveButtonStyle}
                aria-label="Refrescar datos"
                title="Refrescar datos"
              >
                <RefreshCw size={16} className={`mr-1 md:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refrescar</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className={logoutButtonStyle}
              aria-label="Cerrar Sesión"
              title="Cerrar Sesión"
            >
              <LogOut size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;