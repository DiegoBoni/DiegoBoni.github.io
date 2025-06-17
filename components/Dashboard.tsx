import React from 'react';
import { ChatSession, CalculatedStats, TokenCheckResult } from '../types';
import StatCard from './StatCard';
import ConversationsChart from './ConversationsChart';
import SessionsList from './SessionsList';
import { BarChart2, MessageCircle, Cpu, CheckCircle, TrendingUp } from 'lucide-react';

type Theme = 'light' | 'dark';

interface DashboardProps {
  sessions: ChatSession[];
  stats: CalculatedStats;
  tokenInfo: TokenCheckResult;
  clientName: string;
  theme: Theme;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, stats, tokenInfo, clientName, theme }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard label="Total Sesiones" value={stats.totalSessions} icon={BarChart2} iconColorClass="text-sky-500 dark:text-sky-400" />
        <StatCard label="Total Mensajes" value={stats.totalMessages} icon={MessageCircle} iconColorClass="text-green-500 dark:text-green-400" />
        <StatCard label="Créditos Utilizados" value={stats.totalTokensUsed.toLocaleString()} icon={Cpu} iconColorClass="text-orange-500 dark:text-orange-400" />
        <StatCard label="Créditos Disponibles" value={tokenInfo.availableTokens.toLocaleString()} icon={CheckCircle} iconColorClass="text-emerald-500 dark:text-emerald-400" />
        <StatCard label="Promedio Créditos/Msg" value={stats.avgTokensPerMessage} icon={TrendingUp} iconColorClass="text-purple-500 dark:text-purple-400" />
      </section>

      <section className="grid grid-cols-1 gap-4 md:gap-6">
         <ConversationsChart sessions={sessions} theme={theme} />
      </section>
      
      <section>
        <SessionsList sessions={sessions} clientName={clientName} />
      </section>
    </div>
  );
};

export default Dashboard;