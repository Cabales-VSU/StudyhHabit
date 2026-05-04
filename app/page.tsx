"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white">

      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">StudyTrack</h1>

        <Link
          href="/login"
          className="px-5 py-2 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition"
        >
          Login
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
          Stay Consistent. Track Your Study Progress.
        </h2>

        <p className="mt-4 text-lg md:text-xl max-w-xl text-white/90">
          Build better study habits, track your sessions, and stay accountable —
          all in one simple app.
        </p>

        {/* CTA */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold text-lg hover:bg-gray-100 transition shadow-lg"
          >
            Get Started
          </Link>

          <Link
            href="/sign-up"
            className="px-8 py-4 rounded-xl border border-white text-white font-semibold text-lg hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/80 text-sm">
        © {new Date().getFullYear()} StudyTrack. All rights reserved.
      </footer>
    </div>
  );
}