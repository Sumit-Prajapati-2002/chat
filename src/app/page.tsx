'use client';
import ChatPanel from './components/ChatPanel';
// Remove unused imports
// import SideBar from './components/SideBar';
// import { useState } from 'react';

export default function Home() {
  // Remove unused userId or use it
  // const [userId, setUserId] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <ChatPanel />
      </div>
    </main>
  );
}
