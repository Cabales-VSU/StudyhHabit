"use client";

import { useState } from "react";
import { Mail, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { forgetPassword } from '@/lib/auth/auth-actions';

export default function ForgotPasswordSimple() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await forgetPassword(email);
      if (error) throw error;
      setSuccessMessage("Check your email for reset instructions.");
    } catch (err: any) {
      setError(err.message || "Failed to send link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 relative bg-orange-50">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/StudyBitLogo.png")' }} />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-orange-500 via-orange-600 to-amber-600 p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-white fill-current" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">StudyBit</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Forgot Password?</h1>
            <p className="text-orange-100">Enter your email and keep the flame alive</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={submit} className="space-y-6">
              <InputField id="email" type="email" icon={<Mail className="w-5 h-5 text-gray-400" />} label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
              {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-xl">{error}</div>}
              {successMessage && <div className="p-4 text-sm text-orange-700 bg-orange-50 rounded-xl border border-orange-200">{successMessage}</div>}
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl shadow-lg">
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
            </form>
            <div className="mt-8 text-center"><button onClick={() => router.push('/login')} className="text-gray-600 hover:text-orange-600 font-medium">← Back to Login</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}