'use client';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-xl font-bold">ACAI Assistant</h1>
      </div>
      
      <nav className="space-y-2 flex-1 flex flex-col">
        <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition-colors">
          Nova konverzacija
        </button>
        
        {/* TODO: Implement conversation history */}
        <div className="mt-4">
          <h2 className="px-4 text-sm font-semibold text-gray-400 mb-2">Istorija</h2>
          <div className="space-y-1">
            {/* Placeholder for conversation history */}
          </div>
        </div>
        <div className="mt-8">
          <button className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors">
            Podešavanja
          </button>
        </div>
      </nav>
    </div>
  );
}
