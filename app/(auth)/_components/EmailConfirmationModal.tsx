"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { resendEmailConfirmation } from "@/lib/auth/auth-actions";

interface EmailVerificationModalProps {
  email: string;
  onClose: () => void;
}

export default function EmailVerificationModal({
  email,
  onClose,
}: EmailVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      const { error } = await resendEmailConfirmation(email);
      if (error) throw error;

      setMessage("Verification email resent successfully.");
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Failed to resend verification email.");
    } finally {
      setIsLoading(false);
    }
  };

  const gotoEmailProvider = (email: string) => {
    const domain = email.split("@")[1];
    const url = `https://www.${domain}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#F4D35E] rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-[scale-in_0.2s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#1D3557] hover:text-[#FF6B35] transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="text-center space-y-8">
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl text-[#1D3557] leading-relaxed">
              We have sent a verification email to{" "}
              <span className="font-bold">{email}</span>. Please verify your email before continuing
            </p>
          </div>

          {/* Feedback */}
          {message && (
            <p className="text-green-700 font-medium">{message}</p>
          )}
          {error && (
            <p className="text-red-700 font-medium">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => handleResend(email)}
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-4 bg-[#FF6B35] hover:bg-[#FF5520] text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Resend Email"}
            </button>

            <button
              onClick={() => gotoEmailProvider(email)}
              className="w-full sm:w-auto px-10 py-4 bg-[#49A078] hover:bg-[#3d8865] text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Go to Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}