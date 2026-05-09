"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { getWeeklyStats, getUserStats } from "@/lib/stats/actions";
import { Flame, Clock, TrendingUp, Calendar, Loader2 } from "lucide-react";

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState<{day: string, minutes: number}[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadAllStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [weekly, overview] = await Promise.all([
          getWeeklyStats(user.id),
          getUserStats(user.id)
        ]);
        setWeeklyData(weekly);
        setProfile(overview.profile);
      }
      setLoading(false);
    }
    loadAllStats();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  // Find the max minutes to scale the bars correctly
  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 60);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Your Stats</h2>
        <p className="text-slate-500">Visualizing your progress over the last 7 days.</p>
      </div>

      {/* 1. THE STATS BAR CHART */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" /> Weekly Activity
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minutes / Day</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-48 px-2">
          {weeklyData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md mb-1 font-bold">
                {data.minutes}m
              </div>
              
              {/* The actual Bar */}
              <div 
                className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                  data.minutes > 0 ? "bg-orange-500 shadow-lg shadow-orange-100" : "bg-slate-50"
                }`}
                style={{ height: `${(data.minutes / maxMinutes) * 100}%`, minHeight: '4px' }}
              />
              
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                i === 6 ? "text-orange-600" : "text-slate-400"
              }`}>
                {data.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-600 rounded-[32px] p-8 text-white flex items-center justify-between shadow-xl shadow-orange-100">
          <div>
            <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-1">Lifetime Focus</p>
            <h3 className="text-3xl font-bold">{profile?.overall_study_minutes || 0}m</h3>
          </div>
          <Clock size={40} className="opacity-20" />
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Streak</p>
            <h3 className="text-3xl font-bold text-slate-800">{profile?.current_streak || 0} Days</h3>
          </div>
          <Flame size={40} className="text-orange-500 fill-current opacity-20" />
        </div>
      </div>
    </div>
  );
}