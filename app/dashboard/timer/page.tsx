"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Flame, Play, Square, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TimerPage() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState<any>(null);

  const GOAL_MINUTES = 30;
  const GOAL_SECONDS = GOAL_MINUTES * 60;

  // 1. Fetch the current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // 2. Timer Interval Logic
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

  // 3. Formatting Time (00:00:00)
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h + ":" : ""}${m < 10 && h > 0 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 4. Save Session Logic
  const handleFinish = async () => {
    setIsActive(false);
    const sessionMinutes = Math.floor(seconds / 60);

    if (seconds < GOAL_SECONDS) {
      alert(`Wait! You've only studied for ${sessionMinutes} minutes. You need at least 30 minutes to contribute to your group streaks.`);
    } else {
      try {
        // Record the session
        const { error: sessionError } = await supabase.from("study_sessions").insert({
          user_id: user.id,
          duration_minutes: sessionMinutes,
        });

        if (sessionError) throw sessionError;

        // Update lifetime minutes in profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("overall_study_minutes")
          .eq("id", user.id)
          .single();

        const newTotal = (profile?.overall_study_minutes || 0) + sessionMinutes;

        await supabase
          .from("profiles")
          .update({ overall_study_minutes: newTotal })
          .eq("id", user.id);

        alert("Great job! 30 minutes reached. Your streak is safe!");
        setSeconds(0);
      } catch (err: any) {
        console.error("Error saving session:", err.message);
      }
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will clear your current progress.")) {
      setIsActive(false);
      setSeconds(0);
    }
  };

  // Calculate percentage for the circular progress (max 100%)
  const progressPercent = Math.min((seconds / GOAL_SECONDS) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Focus Mode</h2>
        <p className="text-slate-500">Hit the 30-minute mark to keep your group flames burning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timer Display */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-12 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              {/* Progress Circle */}
              <circle 
                cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="12" fill="transparent" 
                className={`transition-all duration-1000 ${seconds >= GOAL_SECONDS ? 'text-orange-500' : 'text-orange-400'}`}
                strokeDasharray={816.8}
                strokeDashoffset={816.8 - (816.8 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="flex flex-col items-center z-10">
              <span className="text-6xl font-mono font-bold text-slate-800 tracking-tight">
                {formatTime(seconds)}
              </span>
              <div className="mt-2 flex items-center gap-1 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                <Flame size={14} className={seconds >= GOAL_SECONDS ? "text-orange-500 fill-current" : ""} />
                Target: 30:00
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-4 w-full max-w-sm">
            {!isActive ? (
              <Button 
                onClick={() => setIsActive(true)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-2xl text-xl font-bold shadow-lg shadow-orange-100 flex items-center justify-center gap-3 transition-transform active:scale-95"
              >
                <Play size={24} fill="currentColor" /> Start
              </Button>
            ) : (
              <Button 
                onClick={handleFinish}
                className="flex-1 bg-slate-900 hover:bg-black text-white h-16 rounded-2xl text-xl font-bold flex items-center justify-center gap-3"
              >
                <Square size={20} fill="currentColor" /> Finish
              </Button>
            )}
            
            <Button 
              onClick={handleReset}
              variant="outline"
              className="w-16 h-16 rounded-2xl border-slate-200 text-slate-400 hover:text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw size={24} />
            </Button>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <h4 className="text-orange-800 font-bold flex items-center gap-2 mb-2">
              <AlertCircle size={18} /> The 30-Minute Rule
            </h4>
            <p className="text-orange-700 text-sm leading-relaxed">
              StudyBit streaks are built on consistency. Only sessions longer than 30 minutes are recorded as "Streak Contributions." 
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-slate-800 font-bold mb-4 text-sm uppercase tracking-wider">Session Tips</h4>
            <ul className="space-y-3">
              {['Silence your phone', 'Grab some water', 'Clear your desk'].map((tip) => (
                <li key={tip} className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}