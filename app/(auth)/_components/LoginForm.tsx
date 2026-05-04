"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { LoginFormProps } from "@/lib/types/types";
import GoogleButton from "./GoogleSignInButton";
import { Mail, Lock, Eye, EyeOff, Smartphone } from "lucide-react";
import EmailVerificationModal from "./EmailConfirmationModal";
import EmailVerifiedModal from "./EmailVerifiedModal";
import TOTPForm from "../_components/TOTPModal";
import { loginUser, verifyMFA } from "@/lib/auth/auth-actions";
import { isValidEmail, validatePassword } from "@/lib/auth/validators";

type FieldErrors = {
  email?: string;
  password?: string;
};

export const LoginForm: React.FC<LoginFormProps> = ({ className, ...props }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAccount = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/sign-up");
  };

  const submit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setGlobalError(null);

      const result = await loginUser(email, password);

      if (result.error) {
        const msg = result.error.message?.toLowerCase() || "";

        if (
          msg.includes("email not confirmed") ||
          msg.includes("confirm your email")
        ) {
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

      // SUCCESS! Redirect to dashboard or home page
      if (result.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setGlobalError(err.message || "Login failed");
      setIsLoading(false); // Only set loading false on error
    }
  };

  const submitTotp = async (code: string) => {
    if (!mfaFactorId || !mfaChallengeId) return;

    try {
      setIsLoading(true);
      const result = await verifyMFA(mfaFactorId, mfaChallengeId, code);
      if (result.error) throw result.error;

      // MFA success - redirect
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setGlobalError(err.message || "MFA failed");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/forgot-password");
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/StudyBitLogo.png")' }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      {/* Right side - Green gradient background */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-emerald-600 via-green-600 to-teal-600 p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">StudyBit</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
            <p className="text-emerald-100 text-base">Sign in to continue learning</p>
          </div>

          {globalError && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">
              {globalError}
            </div>
          )}

          {!requiresMFA ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
              <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-6">
                <InputField
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  error={fieldErrors.email}
                  icon={<Mail className="w-5 h-5 text-gray-400" />}
                />

                <InputField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                  error={fieldErrors.password}
                  icon={<Lock className="w-5 h-5 text-gray-400" />}
                  endAdornment={
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowPassword(v => !v)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  }
                />

                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <GoogleButton />

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={handleCreateAccount}
                    className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>

              {showVerificationModal && (
                <EmailVerificationModal
                  email={email}
                  onClose={() => setShowVerificationModal(false)}
                />
              )}

              {showVerifiedEmailModal && (
                <EmailVerifiedModal
                  onClose={() => setShowVerifiedEmailModal(false)}
                />
              )}
            </div>
          ) : (
            <TOTPForm isLoading={isLoading} onSubmit={submitTotp} />
          )}
        </div>
      </div>
    </div>
  );
};