
import { ChatSession, ChatMessage } from './types';

const escapeCsvValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  // If the string contains a comma, a newline, or a double quote, then enclose it in double quotes.
  // Also, escape existing double quotes by replacing them with two double quotes.
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export const downloadFile = (content: string, filename: string, contentType: string): void => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
};

export const formatSessionToCsv = (session: ChatSession): string => {
  const header = "Timestamp,Role,Content\n";
  const rows = session.messages.map(msg =>
    [
      escapeCsvValue(new Date(msg.timestamp).toISOString()),
      escapeCsvValue(msg.role),
      escapeCsvValue(msg.content)
    ].join(',')
  ).join('\n');
  return header + rows;
};

export const formatAllSessionsToCsv = (sessions: ChatSession[]): string => {
  const header = "Session ID,Session Number,Conversation Started,Message Timestamp,Message Role,Message Content\n";
  let csvContent = header;

  sessions.forEach((session, index) => {
    const sessionNumber = index + 1;
    const sessionId = escapeCsvValue(session.sessionId || 'N/A');
    const conversationStarted = escapeCsvValue(new Date(session.conversationStarted).toISOString());
    
    session.messages.forEach(msg => {
      const row = [
        sessionId,
        escapeCsvValue(sessionNumber),
        conversationStarted,
        escapeCsvValue(new Date(msg.timestamp).toISOString()),
        escapeCsvValue(msg.role),
        escapeCsvValue(msg.content)
      ].join(',');
      csvContent += row + '\n';
    });
  });
  return csvContent;
};
