"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

export default function SubscribePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("subscribe-popup-seen");
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("subscribe-popup-seen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem("subscribe-popup-seen", "true");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl p-8 max-w-md w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <>
                <h2 className="text-2xl font-bold font-display text-dark-900 dark:text-white mb-2 text-center">
                  Stay in the Loop
                </h2>
                <p className="text-dark-500 dark:text-dark-400 mb-6 text-center text-sm">
                  Get the latest tech insights and articles delivered to your inbox.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button type="submit" fullWidth loading={loading}>
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-dark-400 text-center mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold font-display text-dark-900 dark:text-white mb-2">
                  You&apos;re in!
                </h2>
                <p className="text-dark-500 dark:text-dark-400">
                  Thanks for subscribing. Check your inbox soon!
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}