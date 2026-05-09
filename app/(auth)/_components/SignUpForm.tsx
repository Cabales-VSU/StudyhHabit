"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoogleButton from './GoogleSignInButton';
import { InputField } from '@/components/InputField';
import EmailVerificationModal from './EmailConfirmationModal';
import { signUpUser } from '@/lib/auth/auth-actions';
import { isValidEmail, validatePassword } from "@/lib/auth/validators";

export default function SignUpPage({ onSwitchToLogin }: { onSwitchToLogin?: () => void }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await signUpUser(email, password, username);
      if (error) throw error;
      setShowVerificationModal(true);
    } catch (err: any) {
      setGlobalError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/StudyBitLogo.png")' }}>
          <div className="absolute inset-0 bg-black/10" />
        </div>
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
            <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
            <p className="text-orange-100 text-base">Join the group and start your streak</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-center gap-4 pb-8">
              <div className="h-2 w-40 rounded-full bg-orange-600"></div>
              <div className="h-2 w-40 rounded-full bg-orange-100"></div>
            </div>
            
            {globalError && <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">{globalError}</div>}
            
            <form onSubmit={submit} className="space-y-6">
              <InputField label="Full Name" placeholder="Enter your Name" icon={<User className="w-5 h-5 text-gray-400" />} value={username} onChange={(e) => setUsername(e.target.value)} />
              <InputField label="Email Address" placeholder="Enter your Email" type="email" icon={<Mail className="w-5 h-5 text-gray-400" />} value={email} onChange={(e) => setEmail(e.target.value)} />
              <InputField label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter your Password" icon={<Lock className="w-5 h-5 text-gray-400" />} value={password} onChange={(e) => setPassword(e.target.value)} endAdornment={<Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>} />
              <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl shadow-lg">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center"><p className="text-gray-600">Already have an account? <button onClick={() => router.push("/login")} className="text-orange-600 font-bold hover:underline">Sign In</button></p></div>
          </div>
        </div>
      </div>
      {showVerificationModal && <EmailVerificationModal email={email} onClose={() => setShowVerificationModal(false)} />}
    </div>
  );
}