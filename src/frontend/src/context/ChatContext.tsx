'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ChatState, ChatContextType, Message } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { sendChatMessage, fetchMessages, saveMessage } from '../lib/api';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  editMessageId: null,
};

type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'CLEAR_CHAT' }
  | { type: 'UPDATE_MESSAGE'; payload: { messageId: number; content: string } }
  | { type: 'SET_EDIT_MESSAGE_ID'; payload: number | null };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'CLEAR_CHAT':
      return {
        ...initialState,
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.messageId
            ? { ...msg, content: action.payload.content }
            : msg
        ),
      };
    case 'SET_EDIT_MESSAGE_ID':
      return {
        ...state,
        editMessageId: action.payload,
      };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Učitavanje poruka pri mount-u
  useEffect(() => {
    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetchMessages();
      if (res.data) {
        dispatch({ type: 'SET_MESSAGES', payload: res.data });
      } else if (res.error) {
        dispatch({ type: 'SET_ERROR', payload: res.error });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    })();
  }, []);

  const sendMessage = async (content: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const now = new Date().toISOString();
      // 1. Sačuvaj korisničku poruku
      const userMessage: Omit<Message, 'id'> = {
        content,
        sender: 'user',
        timestamp: now,
      };
      const savedUser = await saveMessage(userMessage);
      if (savedUser.data) {
        dispatch({ type: 'SEND_MESSAGE', payload: savedUser.data });
      }
      // 2. Pošalji poruku AI-u
      const response = await sendChatMessage(content);
      if (response.error) {
        throw new Error(response.error);
      }
      // 3. Sačuvaj AI poruku
      const assistantMessage: Omit<Message, 'id'> = {
        content: response.data!.response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      const savedAssistant = await saveMessage(assistantMessage);
      if (savedAssistant.data) {
        dispatch({ type: 'SEND_MESSAGE', payload: savedAssistant.data });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Greška pri slanju poruke.' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' });
  };

  const updateMessage = (messageId: number, newContent: string) => {
    dispatch({
      type: 'UPDATE_MESSAGE',
      payload: { messageId, content: newContent },
    });
  };

  const setEditMessageId = (messageId: number | null) => {
    dispatch({
      type: 'SET_EDIT_MESSAGE_ID',
      payload: messageId,
    });
  };

  return (
    <ChatContext.Provider value={{ state, sendMessage, clearChat, updateMessage, setEditMessageId }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
} 