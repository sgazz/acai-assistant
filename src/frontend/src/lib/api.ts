const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  sources?: Array<{
    title: string;
    content: string;
    relevance: number;
  }>;
  status?: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
  reactions?: Array<{
    type: 'like' | 'dislike' | 'helpful';
    timestamp: number;
  }>;
}

export interface Document {
  id: string;
  filename: string;
  file_type: string;
  status: string;
  created_at: string;
  total_pages: number;
  image_url?: string;
}

export interface DocumentPage {
  id: string;
  document_id: string;
  page_number: number;
  content: string;
  image_url?: string;
}

export async function sendChatMessage(content: string): Promise<ApiResponse<{ 
  response: string;
  sources?: Array<{
    filename: string;
    page_number: number;
  }>;
}>> {
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

export async function fetchDocuments(): Promise<ApiResponse<Document[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri dohvatanju dokumenata');
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
}

export async function fetchDocumentPages(documentId: string): Promise<ApiResponse<DocumentPage[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/document_pages/${documentId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri dohvatanju stranica dokumenta');
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
}

export async function uploadDocument(file: File): Promise<ApiResponse<Document>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri otpremanju dokumenta');
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
}

export async function deleteDocument(documentId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri brisanju dokumenta');
    }

    return { data: undefined };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
}

export async function checkDuplicateDocument(filename: string): Promise<ApiResponse<boolean>> {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/check-duplicate?filename=${encodeURIComponent(filename)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Greška pri proveri duplikata');
    }

    const data = await response.json();
    return { data: data.isDuplicate };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Nepoznata greška',
    };
  }
} 