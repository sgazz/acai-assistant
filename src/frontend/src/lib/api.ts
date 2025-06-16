const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export async function sendChatMessage(content: string): Promise<ApiResponse<{ response: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri komunikaciji sa serverom');
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
}

export async function fetchMessages(): Promise<ApiResponse<Message[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri čitanju poruka');
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
}

export async function saveMessage(message: Omit<Message, 'id'>): Promise<ApiResponse<Message>> {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri čuvanju poruke');
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
} 