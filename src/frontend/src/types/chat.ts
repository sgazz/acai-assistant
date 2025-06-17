export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  editMessageId: number | null;
}

export interface ChatContextType {
  state: ChatState;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  updateMessage: (messageId: number, newContent: string) => void;
  setEditMessageId: (messageId: number | null) => void;
} 