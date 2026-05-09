"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Flame, Play, Square, Users, BarChart3, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const MINIMUM_MINUTES = 30;
  const MINIMUM_SECONDS = MINIMUM_MINUTES * 60;

  // 1. Fetch user profile and total study time
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("overall_study_minutes")
          .eq("id", user.id)
          .single();
        if (profile) setTotalMinutes(profile.overall_study_minutes);
      }
    };
    fetchUserData();
  }, []);

  // 2. Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h + ":" : ""}${m < 10 && h > 0 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleStop = async () => {
    setIsActive(false);
    const sessionMinutes = Math.floor(seconds / 60);

    if (seconds < MINIMUM_SECONDS) {
      alert(`Session ended. You studied for ${sessionMinutes} minutes. Remember: You need 30 minutes to count toward the group streak!`);
    } else {
      // Logic for successful session
      const { error } = await supabase.from("study_sessions").insert({
        user_id: user.id,
        duration_minutes: sessionMinutes,
      });

      if (!error) {
        const newTotal = totalMinutes + sessionMinutes;
        await supabase.from("profiles").update({ overall_study_minutes: newTotal }).eq("id", user.id);
        setTotalMinutes(newTotal);
        alert("Awesome! 30-minute goal reached. Your group streak continues!");
      }
    }
    setSeconds(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Flame className="w-6 h-6 text-orange-600 fill-current" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudyBit</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl font-bold">
            <Clock size={20} /> Timer
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition">
            <Users size={20} /> Groups
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition">
            <BarChart3 size={20} /> Stats
          </button>
        </nav>

        <button 
          onClick={() => supabase.auth.signOut()}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Hello, {user?.user_metadata?.display_name || "Scholar"}!</h2>
              <p className="text-slate-500">Ready to contribute to the streak today?</p>
            </div>
            <div className="flex items-center gap-2 px-5 py-2 bg-orange-100 text-orange-700 rounded-full font-bold shadow-sm">
              <Flame size={20} className="fill-current" /> 14 Day Streak
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Timer Card */}
            <div className="md:col-span-2 bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Circular Progress Bar */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    className="text-orange-500 transition-all duration-1000"
                    strokeDasharray={754}
                    strokeDashoffset={754 - (754 * Math.min(seconds / MINIMUM_SECONDS, 1))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-mono font-bold text-slate-800">{formatTime(seconds)}</span>
                  <span className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Target: 30:00</span>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-xs">
                {!isActive ? (
                  <Button 
                    onClick={() => setIsActive(true)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                  >
                    <Play size={24} fill="currentColor" /> Start
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStop}
                    className="flex-1 bg-slate-900 hover:bg-black text-white h-14 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
                  >
                    <Square size={20} fill="currentColor" /> Finish
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 size={18} className="text-orange-600" /> Lifetime Stats
                </h3>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{totalMinutes}</p>
                  <p className="text-sm text-slate-400 font-medium">Total Minutes Studied</p>
                </div>
              </div>

              {/* Group Pulse Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users size={18} className="text-orange-600" /> VSU Dev Group
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Jonei", status: "Done" },
                    { name: "Lourennz", status: "Studying" },
                    { name: "You", status: isActive ? "Studying" : "Pending" }
                  ].map((m) => (
                    <div key={m.name} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600">{m.name}</span>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        m.status === "Done" ? "bg-green-100 text-green-600" : 
                        m.status === "Studying" ? "bg-orange-100 text-orange-600 animate-pulse" : 
                        "bg-slate-100 text-slate-400"
                      }`}>{m.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}