import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gray-900 text-white flex flex-col border-r border-gray-800">
      <div className="p-4 font-bold text-xl tracking-wide border-b border-gray-800">ACAI Assistant</div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="mt-4 space-y-2">
          <li>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-800 rounded transition">Novi chat</button>
          </li>
          <li className="px-4 py-2 text-gray-400 text-xs uppercase">Chatovi</li>
          <li>
            <div className="px-4 py-2 bg-gray-800 rounded mb-2">Biologija</div>
            <div className="px-4 py-2 hover:bg-gray-800 rounded cursor-pointer">Matematika</div>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">U</div>
        <div>
          <div className="font-semibold">Učenik</div>
          <div className="text-xs text-gray-400">user@email.com</div>
        </div>
      </div>
    </aside>
  );
} 