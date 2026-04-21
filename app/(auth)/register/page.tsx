"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, AtSign, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: "", username: "", email: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (!data.user)  { setError("Something went wrong. Please try again."); setLoading(false); return; }

    const { error: profileError } = await supabase.from("profiles").insert({
      id:       data.user.id,
      email:    form.email,
      name:     form.name,
      username: generateSlug(form.username || form.name),
      role:     "author",
    });

    if (profileError) { setError(profileError.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-dark-950 dark:to-dark-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-10 h-10 text-primary-500" />
            <span className="text-2xl font-bold font-display bg-gradient-to-r from-primary-500 to-rose-500 bg-clip-text text-transparent">XGuard</span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-dark-900 dark:text-white">Create your account</h1>
          <p className="text-dark-500 mt-1">Join and start writing today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-input bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            <Input id="name"     type="text"     label="Full name"    placeholder="Prince Favour" value={form.name}     onChange={set("name")}     leftIcon={<User className="w-4 h-4" />} required />
            <Input id="username" type="text"     label="Username"     placeholder="princefavour"  value={form.username} onChange={set("username")} leftIcon={<AtSign className="w-4 h-4" />} />
            <Input id="email"    type="email"    label="Email"        placeholder="you@example.com" value={form.email}  onChange={set("email")}    leftIcon={<Mail className="w-4 h-4" />} required />
            <Input id="password" type="password" label="Password"     placeholder="Min 6 chars"   value={form.password} onChange={set("password")} leftIcon={<Lock className="w-4 h-4" />} required />
            <Input id="confirm"  type="password" label="Confirm password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} leftIcon={<Lock className="w-4 h-4" />} required />
            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-dark-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
