export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  sources?: Source[];
  status?: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  type: 'like' | 'dislike' | 'helpful' | 'thanks';
  count: number;
  reacted: boolean;
}

export interface Source {
  filename: string;
  content: string;
  page_number?: number;
  relevance_score: number;
  type?: string;
}

export interface Reaction {
  type: 'like' | 'dislike' | 'helpful';
  timestamp: number;
}

export interface ChatTheme {
  primaryColor: string;
  secondaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  messageSpacing: 'compact' | 'comfortable' | 'spacious';
}

export interface UIState {
  theme: ChatTheme;
  sidebarCollapsed: boolean;
  showTimestamps: boolean;
  enableAnimations: boolean;
}

// Typing indicator states
export interface TypingState {
  isTyping: boolean;
  message?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
  editMessageId: number | null;
  isGenerating: boolean;
}

export interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  updateMessage: (messageId: number, content: string) => void;
  setEditMessageId: (messageId: number | null) => void;
  stopGenerating: () => void;
  addReaction: (messageId: number, type: MessageReaction['type']) => void;
  removeReaction: (messageId: number, type: MessageReaction['type']) => void;
} 