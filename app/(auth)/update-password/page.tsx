"use client";
import { useRouter, useSearchParams } from "next/navigation";
import UpdatePasswordForm from "../_components/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const errorParam = searchParams.get("error"); 
  const errorDescription = searchParams.get("error_description");

  if (errorParam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Link Expired</h1>
          <p className="text-gray-700 mb-6">
            {decodeURIComponent(errorDescription || "This password reset link is invalid or has already been used.")}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e65b2d] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-gray-700 mb-6">
            This page was accessed without a valid password reset link.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e65b2d] transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return <UpdatePasswordForm/>;
}

