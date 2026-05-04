"use client";

import Link from "next/link";
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-emerald-50">
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-semibold text-slate-800">StudyTrack</h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-emerald-600 font-medium hover:bg-emerald-50 transition"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            <span>Build better habits</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
            Stay Consistent.
            <br />
            <span className="text-emerald-600">Track Your Study Progress.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Build better study habits, track your sessions, and stay accountable —
            all in one simple, distraction-free app.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 rounded-lg bg-emerald-600 text-white font-medium text-base hover:bg-emerald-700 transition shadow-sm"
            >
              Start studying — it's free
            </Link>

            <Link
              href="/login"
              className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium text-base hover:bg-slate-50 transition"
            >
              Already have an account?
            </Link>
          </div>

          {/* Features preview */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4">
              <Clock className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">Track sessions</h3>
              <p className="text-sm text-slate-500">Log your study time and see your progress over time</p>
            </div>
            <div className="p-4">
              <Target className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">Set goals</h3>
              <p className="text-sm text-slate-500">Create daily and weekly study targets</p>
            </div>
            <div className="p-4">
              <TrendingUp className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold text-slate-800 mb-1">Stay motivated</h3>
              <p className="text-sm text-slate-500">Visualize your streaks and achievements</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100">
        <p>© {new Date().getFullYear()} StudyTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}