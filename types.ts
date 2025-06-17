
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | number; // Assuming timestamp can be string or number (milliseconds)
}

export interface ChatSession {
  sessionId: string; // Or generate one if not present
  conversationStarted: string | number;
  messages: ChatMessage[];
  totalMessages?: number; // Optional, might be calculated or part of data
  tokensSession?: number; // Optional
}

export interface ClientRecord {
  chatHistory: ChatSession[];
  assignedTokens?: number;
  clientName?: string;
}

export interface ClientMetadata {
  name?: string; // Name of the bin from metadata
  totalTokens?: number; // Total tokens used, from original logic
}

export interface FullClientData {
  record: ClientRecord;
  metadata?: { // This structure depends on JSONBin's metadata response
    name?: string; 
    totalTokens?: number; // Assuming metadata.record.totalTokens based on original script's usage
  }; 
}

export interface CalculatedStats {
  totalSessions: number;
  totalMessages: number;
  totalTokensUsed: number;
  avgTokensPerMessage: number;
}

export interface TokenCheckResult {
  hasAccess: boolean;
  assignedTokens: number;
  usedTokens: number;
  availableTokens: number;
}

export enum AppView {
  Login = 'login',
  Dashboard = 'dashboard',
  AccessDenied = 'accessDenied',
}
