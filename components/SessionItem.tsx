import React, { useState } from 'react';
import { ChatSession, ChatMessage } from '../types';
import { ChevronDown, ChevronUp, Download, MessageSquare, User, Bot } from 'lucide-react';
import { downloadFile, formatSessionToCsv } from '../utils';

interface SessionItemProps {
  session: ChatSession;
  sessionNumber: number;
}

const MessageDisplay: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`mb-3 p-3 rounded-lg shadow-sm text-sm ${isUser ? 'bg-indigo-50 dark:bg-indigo-900/30 ml-4' : 'bg-purple-50 dark:bg-purple-900/30 mr-4'}`}>
      <div className={`flex items-center mb-1 font-semibold ${isUser ? 'text-indigo-700 dark:text-indigo-300' : 'text-purple-700 dark:text-purple-300'}`}>
        {isUser ? <User size={16} className="mr-2" /> : <Bot size={16} className="mr-2" />}
        {isUser ? 'Usuario' : 'Asistente'}
        <span className="ml-auto text-xs font-normal text-slate-500 dark:text-slate-400">{new Date(message.timestamp).toLocaleString()}</span>
      </div>
      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{message.content}</p>
    </div>
  );
};

const SessionItem: React.FC<SessionItemProps> = ({ session, sessionNumber }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalMessages = session.totalMessages || session.messages.length;
  const tokensUsed = session.tokensSession || 0;

  const handleDownloadSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    const csvContent = formatSessionToCsv(session);
    downloadFile(csvContent, `sesion_${sessionNumber}_${new Date(session.conversationStarted).toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8');
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg mb-4 shadow-lg overflow-hidden transition-all duration-300 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <div
        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/80 flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`session-messages-${sessionNumber}`}
      >
        <div>
          <h4 className="font-semibold text-indigo-600 dark:text-indigo-400">
            <MessageSquare size={18} className="inline mr-2 align-text-bottom" />
            Sesión {sessionNumber}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {new Date(session.conversationStarted).toLocaleString()} &bull; {totalMessages} mensajes &bull; {tokensUsed} créditos
          </p>
        </div>
        <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadSession}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Descargar esta sesión como CSV"
              title="Descargar esta sesión como CSV"
            >
              <Download size={20} />
            </button>
            {isExpanded ? <ChevronUp size={20} className="text-slate-600 dark:text-slate-400" /> : <ChevronDown size={20} className="text-slate-600 dark:text-slate-400" />}
        </div>
      </div>
      {isExpanded && (
        <div id={`session-messages-${sessionNumber}`} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 max-h-96 overflow-y-auto">
          {session.messages.length > 0 ? (
            session.messages.map((msg, index) => <MessageDisplay key={index} message={msg} />)
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No hay mensajes en esta sesión.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionItem;