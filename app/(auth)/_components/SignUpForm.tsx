"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoogleButton from './GoogleSignInButton';
import { InputField } from '@/components/InputField';
import EmailVerificationModal from './EmailConfirmationModal';
import { signUpUser } from '@/lib/auth/auth-actions';
import { isValidEmail, validatePassword } from "@/lib/auth/validators";

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

interface SignUpProps {
  onSwitchToLogin?: () => void;
}

export default function SignUpPage({ onSwitchToLogin }: SignUpProps) {
   const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const validateForm = () => {
    const errors: FieldErrors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setGlobalError(null);

    try {
      const { error } = await signUpUser(email, password, username);
      
      if (error) {
        throw error;
      }

      setShowVerificationModal(true);
    } catch (err: any) {
      setGlobalError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    if (onSwitchToLogin) onSwitchToLogin();
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left image - hidden on mobile */}
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
          {/* Logo and Title */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">StudyBit</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Create Account
            </h1>
            <p className="text-emerald-100 text-base">
              Join us and start your learning journey
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Progress indicators */}
            <div className="flex items-center justify-center gap-4 pb-8">
              <div className="h-2 w-40 rounded-full bg-emerald-600"></div>
              <div className="h-2 w-40 rounded-full bg-emerald-200"></div>
            </div>
            
            {globalError && (
              <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">
                {globalError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields */}
              <InputField
                label="Full Name"
                placeholder="Enter your Full Name"
                icon={<User className="w-5 h-5 text-gray-400" />}
                value={username}
                error={fieldErrors.username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) clearFieldError('username');
                }}
              />

              <InputField
                label="Email Address"
                placeholder="Enter your Email Address"
                type="email"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                value={email}
                error={fieldErrors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) clearFieldError('email');
                }}
              />

              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                value={password}
                error={fieldErrors.password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) clearFieldError('password');
                }}
                endAdornment={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                }
              />

              <InputField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Enter your Password Again"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                value={confirmPassword}
                error={fieldErrors.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) clearFieldError('confirmPassword');
                }}
                endAdornment={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                }
              />

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a className="text-emerald-600 font-medium hover:text-emerald-700 cursor-pointer">
                    Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a className="text-emerald-600 font-medium hover:text-emerald-700 cursor-pointer">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <GoogleButton nextRoute="/dashboard" />

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && email && (
        <EmailVerificationModal
          email={email}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}