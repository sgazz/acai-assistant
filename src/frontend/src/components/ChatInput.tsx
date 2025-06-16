'use client';

import { useState } from 'react';
import { useChatContext } from '../context/ChatContext';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const { sendMessage, state: { isLoading } } = useChatContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    await sendMessage(message.trim());
    setMessage('');
  };

  return (
    <div className="w-full border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napišite poruku..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none text-gray-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400"
          disabled={!message.trim() || isLoading}
        >
          {isLoading ? 'Šalje se...' : 'Pošalji'}
        </button>
      </form>
    </div>
  );
}
