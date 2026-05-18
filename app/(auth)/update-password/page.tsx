"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updatePassword } from "@/lib/auth/auth-actions";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { Lock, Loader2, KeyRound } from "lucide-react";

// 1. Isolate the form component using useSearchParams()
function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Password is required.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await updatePassword(password);
      if (error) throw error;

      setSuccessMsg("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div>
        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
          New Password
        </label>
        <InputField
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label=""
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">
          Confirm New Password
        </label>
        <InputField
          type="password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label=""
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-xl">
          ⚠️ {errorMsg}
        </p>
      )}

      {successMsg && (
        <p className="text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl">
          🎉 {successMsg}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-95 flex items-center justify-center"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
      </Button>
    </form>
  );
}

// 2. Main structural layout wrapping the child with a Suspense boundary
export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-md p-8 md:p-10 shadow-xl border border-slate-100">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Reset Your Password
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Enter your secure new password credentials below.
          </p>
        </div>

        {/* The Suspense wrapper lets the compiler pass safely during compilation builds */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Loading Secure Context...
              </p>
            </div>
          }
        >
          <UpdatePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}