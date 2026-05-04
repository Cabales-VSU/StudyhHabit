"use client";

import { Lock, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { useState } from "react";

interface TOTPFormProps {
  isLoading: boolean;
  onSubmit: (code: string) => void;
}

export default function TOTPForm({ isLoading, onSubmit }: TOTPFormProps) {
  const [totpCode, setTotpCode] = useState("");

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
          <Smartphone className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
      </div>

      <InputField
        id="totp"
        type="text"
        label="Authentication Code"
        value={totpCode}
        placeholder="000000"
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />

      <Button
        type="button"
        onClick={() => onSubmit(totpCode)}
        disabled={isLoading || totpCode.length !== 6}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </div>
  );
}