"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const config: Record<ToastType, { icon: React.ReactNode; classes: string }> = {
  success: { icon: <CheckCircle className="w-5 h-5" />, classes: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700" },
  error:   { icon: <XCircle className="w-5 h-5" />,     classes: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700" },
  info:    { icon: <Info className="w-5 h-5" />,         classes: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700" },
};

export default function Toast({ message, type = "info", onClose }: ToastProps) {
  const { icon, classes } = config[type];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className={cn("fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-card border shadow-lg max-w-sm", classes)}
      >
        {icon}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
