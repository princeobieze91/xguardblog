import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    redirect("/login");
  }

  // Check if email is verified
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.email_confirmed_at) {
    // Email already verified, redirect to dashboard
    redirect("/dashboard");
  }

  // Show verification pending page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white dark:from-dark-950 dark:to-dark-900 px-4">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold font-display text-dark-900 dark:text-white">
          Verify your email
        </h1>
        <p className="text-dark-500 dark:text-dark-400 max-w-md">
          We have sent a verification link to <strong className="text-primary-500">{user?.email}</strong>. 
          Please check your inbox and click the link to verify your email address.
        </p>
        <div className="space-y-2">
          <button 
            onClick={() => window.location.reload()}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-11.031-2.247m0 0A8.006 8.006 0 003 14.472V12a5.986 5.986 0 0111.956-5.69m0 0a5.996 5.996 0 00-11.956 5.69m0 0H4v5h.582m15.356-2A8.001 8.001 0 0119.417 11M16 18v3m0 0l3-3m-3 3V9" />
            </svg>
            Resend verification email
          </button>
          <button 
            onClick={() => {
              supabase.auth.resend({
                type: 'signup',
                email: user?.email || ''
              });
              alert('Verification email resent!');
            }}
            className="btn-ghost flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-11.031-2.247m0 0A8.006 8.006 0 003 14.472V12a5.986 5.986 0 0111.956-5.69m0 0a5.996 5.996 0 00-11.956 5.69m0 0H4v5h.582m15.356-2A8.001 8.001 0 0119.417 11M16 18v3m0 0l3-3m-3 3V9" />
            </svg>
            Resend verification email
          </button>
        </div>
        <div className="mt-6">
          <a 
            href="/login" 
            className="text-sm text-primary-500 hover:underline"
          >
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}
