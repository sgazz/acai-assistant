import React from 'react';
import { dummyMessages } from '../features/chat/DummyChatData';

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-gray-100 dark:bg-gray-950">
      {dummyMessages.map((msg) => (
        <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xl px-4 py-2 rounded-lg shadow ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
} 