export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  sources?: Source[];
  status?: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
  reactions?: Reaction[];
}

export interface Source {
  title: string;
  content: string;
  relevance: number;
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
  error: string | null;
  editMessageId: number | null;
  isTyping: boolean;
}

export interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  updateMessage: (messageId: number, newContent: string) => void;
  setEditMessageId: (messageId: number | null) => void;
  stopGenerating: () => void;
} 