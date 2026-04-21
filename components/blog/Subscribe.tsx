"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setError("");
    
    const { error: err } = await supabase.from("subscribers").insert({ email: email.trim() });
    
    if (err) {
      if (err.message.includes("duplicate")) {
        setError("You're already subscribed!");
      } else {
        setError(err.message);
      }
      setLoading(false);
      return;
    }
    
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-card p-6 text-center">
        <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
        <p className="text-green-700 dark:text-green-400 font-medium">Thanks for subscribing!</p>
        <p className="text-sm text-green-600 dark:text-green-500">You'll get notified about new posts.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 dark:bg-dark-800 rounded-card p-8 text-center">
      <Mail className="w-8 h-8 text-primary-500 mx-auto mb-3" />
      <h3 className="text-xl font-bold text-white mb-2">Subscribe to the Blog</h3>
      <p className="text-dark-400 mb-4 text-sm">Get the latest articles delivered to your inbox.</p>
      
      <form onSubmit={subscribe} className="flex gap-2 max-w-md mx-auto">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-dark-800 border-dark-700 text-white placeholder:text-dark-500"
          required
        />
        <Button type="submit" loading={loading}>
          Subscribe
        </Button>
      </form>
      
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}