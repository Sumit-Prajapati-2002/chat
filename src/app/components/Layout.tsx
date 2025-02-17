'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Dynamically import components with no SSR
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });
const ChatPanel = dynamic(() => import('./ChatPanel'), { ssr: false });
const SideBar = dynamic(() => import('./SideBar'), { ssr: false });

interface LayoutProps {
  userId: string;
}

export default function Layout({ userId }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0B1120] overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0" style={{ zIndex: -1 }}>
        <div className="absolute inset-0 bg-[#0B1120]">
          {/* Primary gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-emerald-600/10"
            animate={{
              opacity: [0.5, 0.7, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          {/* Glowing orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
            animate={{
              x: [50, -50, 50],
              y: [30, -30, 30],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="z-50">
          <Navbar />
        </div>

        {/* Main content with max-width container */}
        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8 h-[calc(100vh-theme(spacing.24))]">
            {/* Chat Panel with card styling */}
            <ChatPanel/>

            {/* Sidebar with card styling */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
