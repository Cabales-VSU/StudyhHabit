"use client";
import { useRouter } from "next/navigation";
import { Flame, CheckCircle2 } from "lucide-react";

export default function Success() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 relative bg-orange-50">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/StudyBitLogo.png")' }} />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-orange-500 via-orange-600 to-amber-600 p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-14 h-14 bg-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Flame className="w-8 h-8 text-white fill-current" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">StudyBit</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-orange-600" strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Account Ready!</h1>
            <p className="text-gray-600 text-base mb-8">Your journey begins now. Start your first 30-minute session to contribute to the streak.</p>
            <button onClick={() => router.push("/dashboard/timer")} className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}