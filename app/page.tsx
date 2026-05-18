"use client";

import Link from "next/link";
import { BookOpen, Clock, Flame, Users, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-orange-600" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudyBit</h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="px-5 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition shadow-sm"
          >
            Join the Group
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
            <Flame className="w-4 h-4 fill-current" />
            <span>Keep the Flame Alive</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
            Consistency is a Team Sport.
            <br />
            <span className="text-orange-600">30 Mins Daily. No Excuses.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            The study habit tracker inspired by streaks. Join a group, hit your 
            minimum 30-minute session, and keep the collective streak growing.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-3 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-200"
            >
              Start Your First 30 Mins
            </Link>

            <Link
              href="/login"
              className="px-8 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium text-lg hover:bg-slate-50 transition"
            >
              Check My Streaks
            </Link>
          </div>

          {/* Features preview */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Clock className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">The 30-Min Rule</h3>
              <p className="text-sm text-slate-500">Only sessions over 30 minutes count toward your group's daily goal. Deep focus only.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Users className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Group Accountability</h3>
              <p className="text-sm text-slate-500">Create groups with friends. If one person misses their 30 mins, the streak resets.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Flame className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Weekly Momentum</h3>
              <p className="text-sm text-slate-500">Visualize your weekly study volume and compete to have the longest-running flame.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100">
        <p>© {new Date().getFullYear()} StudyBit. Fueling consistency.</p>
      </footer>
    </div>
  );
}