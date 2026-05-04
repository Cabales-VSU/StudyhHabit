"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { updatePassword } from "@/lib/auth/auth-actions";
import { validatePassword } from "@/lib/auth/validators";

type FieldErrors = {
  password?: string;
  confirmPassword?: string;
};

export default function UpdatePasswordForm() {
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  const validateForm = () => {
    const errors: FieldErrors = {};

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

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setGlobalError(null);
    setGlobalSuccess(null);
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await updatePassword(password);
      
      if (error) throw error;

      setGlobalSuccess("Password updated successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setGlobalError(err.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
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
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">StudyBit</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Reset Password
            </h1>
            <p className="text-emerald-100 text-base">
              Enter your new password below
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={submit} className="space-y-6">
              <InputField
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                error={fieldErrors.password}
              />

              <InputField
                label="Confirm New Password"
                type="password"
                placeholder="Confirm your new password"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                error={fieldErrors.confirmPassword}
              />

              {globalError && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">
                  {globalError}
                </div>
              )}

              {globalSuccess && (
                <div className="p-4 text-sm text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {globalSuccess}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}