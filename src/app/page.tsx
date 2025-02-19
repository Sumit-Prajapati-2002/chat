'use client';
import ChatPanel from './components/ChatPanel';
import Layout from './components/Layout';
// Remove unused imports
// import SideBar from './components/SideBar';
// import { useState } from 'react';

export default function Home() {
  // Remove unused userId or use it
  // const [userId, setUserId] = useState<string | null>(null);

  return (
    <Layout>
      <div className="flex flex-1 space-x-6">
        <ChatPanel />
      </div>
    </Layout>
  );
}
