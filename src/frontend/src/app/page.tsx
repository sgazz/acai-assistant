import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <ChatWindow />
        <ChatInput />
      </main>
    </div>
  );
}
