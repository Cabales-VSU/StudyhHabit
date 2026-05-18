"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { LoginFormProps } from "@/lib/types/types";
import GoogleButton from "./GoogleSignInButton";
import { Mail, Lock, Eye, EyeOff, Flame } from "lucide-react";
import EmailVerificationModal from "./EmailConfirmationModal";
import EmailVerifiedModal from "./EmailVerifiedModal";
import TOTPForm from "./TOTPModal";
import { loginUser, verifyMFA } from "@/lib/auth/auth-actions";
import { isValidEmail, validatePassword } from "@/lib/auth/validators";

export const LoginForm: React.FC<LoginFormProps> = ({ className, ...props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVerifiedEmailModal, setShowVerifiedEmailModal] = useState(false);

  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setShowVerifiedEmailModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors: any = {};
    if (!email.trim() || !isValidEmail(email)) errors.email = "Valid email is required";
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      setGlobalError(null);
      const result = await loginUser(email, password);
      if (result.error) {
        if (result.error.message?.toLowerCase().includes("confirm")) {
          setShowVerificationModal(true);
          return;
        }
        throw result.error;
      }
      if (result.requiresMFA) {
        setRequiresMFA(true);
        setMfaChallengeId(result.challengeId ?? null);
        setMfaFactorId(result.factorId ?? null);
        return;
      }
      if (result.user) router.push("/dashboard/timer");
    } catch (err: any) {
      setGlobalError(err.message || "Login failed");
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
            <h1 className="text-4xl font-bold text-white mb-3 text-shadow">Welcome Back</h1>
            <p className="text-orange-100 text-base">Sign in to keep your streak alive</p>
          </div>

          {globalError && <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">{globalError}</div>}

          {!requiresMFA ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
              <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
                <InputField id="email" type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldErrors.email} icon={<Mail className="w-5 h-5 text-gray-400" />} />
                <InputField id="password" type={showPassword ? "text" : "password"} label="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldErrors.password} icon={<Lock className="w-5 h-5 text-gray-400" />} 
                  endAdornment={<Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(v => !v)} className="text-gray-500 hover:text-gray-700">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>} />
                <div className="text-right"><button type="button" onClick={() => router.push("/forgot-password")} className="text-sm text-orange-600 hover:text-orange-700 font-medium">Forgot Password?</button></div>
                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div><div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div></div>
              <GoogleButton />
              <div className="text-center"><p className="text-gray-600">Don't have an account? <button onClick={() => router.push("/sign-up")} className="text-orange-600 font-bold hover:underline">Create Account</button></p></div>
              {showVerificationModal && <EmailVerificationModal email={email} onClose={() => setShowVerificationModal(false)} />}
              {showVerifiedEmailModal && <EmailVerifiedModal onClose={() => setShowVerifiedEmailModal(false)} />}
            </div>
          ) : (
            <TOTPForm isLoading={isLoading} onSubmit={async (code) => { /* MFA logic */ }} />
          )}
        </div>
      </div>
    </div>
  );
};