import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChatSession } from '../types';

type Theme = 'light' | 'dark';

interface ConversationsChartProps {
  sessions: ChatSession[];
  theme: Theme;
}

const ConversationsChart: React.FC<ConversationsChartProps> = ({ sessions, theme }) => {
  const processDataForChart = () => {
    const dateCounts: { [key: string]: number } = {};
    sessions.forEach(session => {
      const dateStr = new Date(session.conversationStarted).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    return Object.entries(dateCounts)
      .map(([date, count]) => ({ date, conversations: count }))
      .sort((a,b) => {
        try {
          const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
          const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return dateA - dateB;
          }
        } catch (e) { /* Fallback */ }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  };

  const chartData = processDataForChart();

  // Define theme-based colors
  const isDark = theme === 'dark';
  const tickColor = isDark ? '#94a3b8' : '#475569'; // dark:slate-400, light:slate-600
  const tooltipBackgroundColor = isDark ? 'rgba(51, 65, 85, 0.95)' : 'rgba(255, 255, 255, 0.95)'; // dark:slate-700/95, light:white/95
  const tooltipLabelColor = isDark ? '#e2e8f0' : '#334155'; // dark:slate-200, light:slate-700
  const tooltipItemColor = isDark ? '#818cf8' : '#4f46e5'; // dark:indigo-400, light:indigo-600
  const legendColor = isDark ? '#94a3b8' : '#475569'; // dark:slate-400, light:slate-600
  const cartesianGridStroke = isDark ? '#334155' : '#e2e8f0'; // dark:slate-700, light:slate-200
  const cartesianGridStrokeOpacity = isDark ? 0.3 : 0.5;
  const tooltipCursorFill = isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.3)'; // dark:slate-600/30, light:slate-300/30
  const barFill = isDark ? '#818cf8' : '#6366f1'; // dark:indigo-400, light:indigo-500

  if (!chartData || chartData.length === 0) {
    return <div className="text-center py-8 text-slate-500 dark:text-slate-400">No hay datos de conversaciones para mostrar.</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 md:p-6 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 h-80 md:h-96">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">Conversaciones por Día</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={cartesianGridStroke} strokeOpacity={cartesianGridStrokeOpacity} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: tickColor }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: tooltipBackgroundColor, 
              borderRadius: '0.5rem', 
              borderColor: isDark ? '#475569' : '#cbd5e1' // dark:slate-600, light:slate-300
            }}
            labelStyle={{ color: tooltipLabelColor, fontWeight: 'bold' }}
            itemStyle={{ color: tooltipItemColor }}
            cursor={{fill: tooltipCursorFill}}
          />
          <Legend wrapperStyle={{ fontSize: '0.875rem', color: legendColor, paddingTop: '10px' }} />
          <Bar dataKey="conversations" fill={barFill} name="Conversaciones" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversationsChart;