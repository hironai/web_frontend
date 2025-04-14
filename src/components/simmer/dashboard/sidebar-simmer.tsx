"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  LogOut,
  Boxes
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "Users" },
  { icon: Boxes, label: "Products" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

export function SidebarSimmer() {
  return (
    <div className="w-64 bg-white h-full flex flex-col">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="h-8 w-34 bg-gray-200 rounded-md animate-pulse" />
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="h-10 w-34 bg-gray-100 rounded-md animate-pulse" />
          </motion.div>
        ))}
      </nav>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 border-t"
      >
        <div className="h-8 w-34 bg-gray-100 rounded-md animate-pulse" />
      </motion.div>
    </div>
  );
}