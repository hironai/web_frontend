"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SidebarSimmer } from "./sidebar-simmer";

export function DashboardLayoutSimmer({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"
        />
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          {isSidebarOpen ? <X size={24} /> : <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />}
        </button>
      </nav>

      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 z-50 md:hidden"
        >
          <SidebarSimmer />
        </motion.div>
      )}

      {/* Desktop Layout */}
      <div className="flex">
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="hidden md:block w-64 min-h-screen"
        >
          <SidebarSimmer />
        </motion.div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}