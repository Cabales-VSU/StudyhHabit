"use client";

import { useState } from "react";
import { Mail, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InputField } from '@/components/InputField';
import { Button } from '@/components/ui/button';
import { forgetPassword } from '@/lib/auth/auth-actions';
import { isValidEmail } from "@/lib/auth/validators";

export default function ForgotPasswordSimple() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email");
      return false;
    }

    return true;
  };

  const submit = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await forgetPassword(email);
      
      if (error) throw error;

      setSuccessMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const onBackToLogin = () => {
    router.push('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const getEmailLink = (email: string) => {
    // Common email provider URLs
    const domain = email.split('@')[1];
    const emailProviders: Record<string, string> = {
      'gmail.com': 'https://mail.google.com',
      'yahoo.com': 'https://mail.yahoo.com',
      'outlook.com': 'https://outlook.live.com',
      'hotmail.com': 'https://outlook.live.com',
      'protonmail.com': 'https://mail.proton.me',
    };
    
    return emailProviders[domain] || 'https://mail.google.com';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      <div className="hidden md:flex md:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/StudyBitLogo.png")' }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-emerald-600 via-green-600 to-teal-600 p-6 md:p-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">StudyBit</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Forgot Password?
            </h1>
            <p className="text-emerald-100 text-base">
              Don't worry! Enter your email and we'll send you reset instructions
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                id="email"
                type="email"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                label="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email address"
                className="w-full"
                required
              />

              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">
                  {error}
                </div>
              )}


              {successMessage && (
                <div className="space-y-3">
                  <div className="p-4 text-sm text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    {successMessage}
                  </div>
                  
                  <a
                    href={getEmailLink(email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                  >
                    Go to your email → 📬
                  </a>
                </div>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={onBackToLogin}
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}