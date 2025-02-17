'use client';
import ChatPanel from "./components/ChatPanel";
import SideBar from "./components/SideBar";
import Layout from "./components/Layout";
import { useState } from 'react';

export default function Home() {
 

  // For demo purposes, we'll use a fixed userId
  // In a real app, this would come from your authentication system
  const userId = "user123";

  return (
    <>
      <Layout>
        <div className="flex flex-1 space-x-6">
          {/* Pass the state setter, file path, and userId to ChatPanel and SideBar */}
          <ChatPanel/>
        </div>
      </Layout>
      
    </>
  );
}
