"use client";

import { motion } from "framer-motion";

export function LoadingCard({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-lg shadow-sm space-y-4"
    >
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-4/6 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </motion.div>
  );
}