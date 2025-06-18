'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { ChatState, ChatContextType, Message } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { sendChatMessage, fetchMessages, saveMessage } from '../lib/api';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  editMessageId: null,
  isTyping: false,
};

type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'CLEAR_CHAT' }
  | { type: 'UPDATE_MESSAGE'; payload: { messageId: number; content: string } }
  | { type: 'SET_EDIT_MESSAGE_ID'; payload: number | null }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'STOP_GENERATING' };

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
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };
    case 'STOP_GENERATING':
      return {
        ...state,
        isLoading: false,
        isTyping: false,
      };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetchMessages();
      if (res.data) {
        // Konvertuj timestamp-ove iz stringa u broj
        const messages = res.data.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp).getTime(),
        }));
        dispatch({ type: 'SET_MESSAGES', payload: messages });
      } else if (res.error) {
        dispatch({ type: 'SET_ERROR', payload: res.error });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    })();
  }, []);

  const sendMessage = async (content: string) => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_TYPING', payload: true });
      
      const timestamp = Date.now();
      // 1. Sačuvaj korisničku poruku
      const userMessage: Omit<Message, 'id'> = {
        content,
        sender: 'user',
        timestamp,
        status: 'sending',
      };
      
      const savedUser = await saveMessage({
        ...userMessage,
        timestamp: new Date(timestamp).toISOString(),
      });
      
      if (savedUser.data) {
        const formattedUserMessage: Message = {
          ...savedUser.data,
          timestamp,
          status: 'sent',
        };
        dispatch({ type: 'SEND_MESSAGE', payload: formattedUserMessage });
      }
      
      // 2. Pošalji poruku AI-u
      const response = await sendChatMessage(content);
      if (response.error) {
        throw new Error(response.error);
      }
      
      // 3. Sačuvaj AI poruku
      const aiTimestamp = Date.now();
      const assistantMessage: Omit<Message, 'id'> = {
        content: response.data!.response,
        sender: 'assistant',
        timestamp: aiTimestamp,
        sources: response.data!.sources?.map(source => ({
          title: source.filename,
          content: `Page ${source.page_number}`,
          relevance: 1,
        })),
        status: 'sending',
      };
      
      const savedAssistant = await saveMessage({
        ...assistantMessage,
        timestamp: new Date(aiTimestamp).toISOString(),
      });
      
      if (savedAssistant.data) {
        const formattedAssistantMessage: Message = {
          ...savedAssistant.data,
          timestamp: aiTimestamp,
          status: 'sent',
        };
        dispatch({ type: 'SEND_MESSAGE', payload: formattedAssistantMessage });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        dispatch({ type: 'SET_ERROR', payload: 'Generisanje odgovora je prekinuto.' });
      } else {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Greška pri slanju poruke.' 
        });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_TYPING', payload: false });
      abortControllerRef.current = null;
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

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    dispatch({ type: 'STOP_GENERATING' });
  };

  return (
    <ChatContext.Provider value={{ 
      state, 
      sendMessage, 
      clearChat, 
      updateMessage, 
      setEditMessageId,
      stopGenerating 
    }}>
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