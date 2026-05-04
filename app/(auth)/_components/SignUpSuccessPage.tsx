"use client";
import { useRouter } from "next/navigation";
import { Smartphone, CheckCircle2 } from "lucide-react";

export default function Success() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push("/dashboard");
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
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">StudyBit</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-600" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Account Created Successfully!
            </h1>
            
            <p className="text-gray-600 text-base mb-2">
              Your account has been verified and is ready to use.
            </p>
            
            <p className="text-gray-600 text-base mb-8">
              Press the button below to begin your learning journey.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleStartLearning}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Start Learning
              </button>
              
              <p className="text-xs text-gray-400 mt-4">
                May your learning journey be successful!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}