'use client';
import ChatPanel from './components/ChatPanel';
import Layout from './components/Layout';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Layout>
          <div className="flex flex-1 space-x-6">
            <ChatPanel />
          </div>
        </Layout>
      </main>
    </div>
  );
}
