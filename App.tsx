import React, { useState, useEffect, useCallback } from 'react';
import { MASTER_KEY, LOCAL_STORAGE_BIN_ID_KEY, LOCAL_STORAGE_THEME_KEY } from './constants';
import { fetchClientDataAndMetadata } from './services/dataService';
import { AppView, ClientRecord, ClientMetadata, CalculatedStats, TokenCheckResult, ChatSession } from './types';
import Header from './components/Header';
import LoginSection from './components/LoginSection';
import Dashboard from './components/Dashboard';
import AccessDenied from './components/AccessDenied';
import LoadingIndicator from './components/LoadingIndicator';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Login);
  const [binId, setBinId] = useState<string>('');
  const [clientRecord, setClientRecord] = useState<ClientRecord | null>(null);
  const [clientMetadata, setClientMetadata] = useState<ClientMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [clientDisplayName, setClientDisplayName] = useState<string>('Cliente Desconocido');
  const [calculatedStats, setCalculatedStats] = useState<CalculatedStats | null>(null);
  const [tokenCheckResult, setTokenCheckResult] = useState<TokenCheckResult | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedBinId = localStorage.getItem(LOCAL_STORAGE_BIN_ID_KEY);
    if (savedBinId) {
      setBinId(savedBinId);
    }
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const determineClientDisplayName = useCallback((record: ClientRecord | null, meta: ClientMetadata | null, currentBinId: string): string => {
    if (record?.clientName) return record.clientName;
    if (meta?.name) return meta.name;
    return currentBinId ? `Cliente ${currentBinId.substring(0, 8)}...` : 'Cliente Desconocido';
  }, []);

  const performTokenCheck = useCallback((record: ClientRecord | null, meta: ClientMetadata | null): TokenCheckResult => {
    const assigned = record?.assignedTokens || 0;
    const usedByMetadata = meta?.totalTokens;
    const usedByChatHistory = record?.chatHistory?.reduce((sum, s) => sum + (s.tokensSession || 0), 0) || 0;
    const used = typeof usedByMetadata === 'number' ? usedByMetadata : usedByChatHistory;
    const available = assigned - used;
    return {
      hasAccess: available > 0 || assigned === 0,
      assignedTokens: assigned,
      usedTokens: used,
      availableTokens: available,
    };
  }, []);
  
  const performCalculations = useCallback((record: ClientRecord | null) => {
    if (!record || !record.chatHistory) {
      setCalculatedStats(null);
      return;
    }
    const sessions = record.chatHistory;
    let totalMessages = 0;
    let totalTokens = 0;
    sessions.forEach(session => {
      totalMessages += session.totalMessages || session.messages.length;
      totalTokens += session.tokensSession || 0;
    });
    setCalculatedStats({
      totalSessions: sessions.length,
      totalMessages,
      totalTokensUsed: totalTokens,
      avgTokensPerMessage: totalMessages > 0 ? Math.round(totalTokens / totalMessages) : 0,
    });
  }, []);


  const processAndSetData = useCallback((loadedRecord: ClientRecord, loadedMetadata: ClientMetadata | null, currentBinId: string) => {
    setClientRecord(loadedRecord);
    setClientMetadata(loadedMetadata);

    const displayName = determineClientDisplayName(loadedRecord, loadedMetadata, currentBinId);
    setClientDisplayName(displayName);

    const tokens = performTokenCheck(loadedRecord, loadedMetadata);
    setTokenCheckResult(tokens);
    
    performCalculations(loadedRecord);

    if (tokens.hasAccess) {
      setCurrentView(AppView.Dashboard);
    } else {
      setCurrentView(AppView.AccessDenied);
    }
  }, [determineClientDisplayName, performTokenCheck, performCalculations]);


  const loadData = useCallback(async (currentBinId: string) => {
    if (!currentBinId) {
      setError('Por favor, ingresa el ID del cliente.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { recordData, metadata } = await fetchClientDataAndMetadata<ClientRecord, ClientMetadata>(currentBinId, MASTER_KEY);
      if (!recordData || !recordData.chatHistory) {
        throw new Error('Formato de datos inválido o historial de chat no encontrado.');
      }
      localStorage.setItem(LOCAL_STORAGE_BIN_ID_KEY, currentBinId);
      setBinId(currentBinId);
      processAndSetData(recordData, metadata, currentBinId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos.';
      setError(`Error al cargar los datos: ${errorMessage}`);
      setCurrentView(AppView.Login);
      setClientRecord(null);
      setClientMetadata(null);
      setCalculatedStats(null);
      setTokenCheckResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [processAndSetData]);

  const handleRefresh = useCallback(() => {
    if (binId) {
      loadData(binId);
    }
  }, [binId, loadData]);

  const handleLogout = () => {
    setCurrentView(AppView.Login);
    setClientRecord(null);
    setClientMetadata(null);
    setError(null);
    setCalculatedStats(null);
    setTokenCheckResult(null);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case AppView.Dashboard: return `Dashboard - ${clientDisplayName}`;
      case AppView.AccessDenied: return `Acceso Restringido - ${clientDisplayName}`;
      default: return 'Dashboard de Conversaciones';
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentView) {
      case AppView.Dashboard: return `Análisis de conversaciones para ${clientDisplayName}`;
      case AppView.AccessDenied: return `Tokens insuficientes para ${clientDisplayName}`;
      default: return 'Analiza el historial de conversaciones';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-2 md:py-5 min-h-screen flex flex-col">
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        currentView={currentView}
        onLogout={handleLogout}
        onRefresh={currentView === AppView.Dashboard ? handleRefresh : undefined}
        isLoading={isLoading && currentView === AppView.Dashboard }
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="flex-grow">
        {currentView === AppView.Login && (
          <LoginSection 
            onLoadData={(id) => loadData(id)} 
            initialBinId={binId}
            isLoading={isLoading && currentView === AppView.Login}
            error={error}
          />
        )}
        {isLoading && (currentView === AppView.Dashboard || currentView === AppView.AccessDenied) && <LoadingIndicator message="Actualizando datos..." />}
        
        {!isLoading && currentView === AppView.Dashboard && clientRecord && calculatedStats && tokenCheckResult && (
          <Dashboard 
            sessions={clientRecord.chatHistory || []} 
            stats={calculatedStats}
            tokenInfo={tokenCheckResult}
            clientName={clientDisplayName}
            theme={theme}
          />
        )}
        {!isLoading && currentView === AppView.AccessDenied && tokenCheckResult && (
          <AccessDenied tokenInfo={tokenCheckResult} binId={binId} clientName={clientDisplayName} />
        )}
      </main>
      <footer className="text-center py-4 mt-8">
        <p className="text-xs text-indigo-700 dark:text-indigo-400">&copy; {new Date().getFullYear()} Conversation Dashboard App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;