"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGroupPulse } from "@/lib/groups/actions";
import { Flame, ArrowLeft, User, Clock, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupPulsePage() {
  const { id } = useParams();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Pulse Data on load with safety check
  useEffect(() => {
    const fetchPulse = async () => {
      if (!id) return;
      try {
        const data = await getGroupPulse(id as string);
        setMembers(data);
      } catch (err) {
        console.error("Pulse error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPulse();
  }, [id]);

  // 2. Calculations for Team Readiness
  const finishedCount = members.filter(m => m.hasFinishedToday).length;
  const progressPercent = members.length > 0 ? (finishedCount / members.length) * 100 : 0;

  // 3. Copy to Clipboard Helper
  const copyGroupId = () => {
    if (id) {
      navigator.clipboard.writeText(id as string);
      alert("Group ID copied! Send this to your teammates.");
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Syncing Squad Momentum...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Groups
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Flame className="text-white fill-current" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Group Pulse</h2>
            <p className="text-slate-400 text-sm font-mono uppercase tracking-tighter">
              ID: {id && typeof id === 'string' ? id.slice(0, 8) : "..."}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={copyGroupId}
          variant="outline"
          className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs px-6 h-12 flex items-center gap-2 hover:bg-slate-50 transition-all"
        >
          <Copy size={14} /> Copy Full ID
        </Button>
      </div>

      {/* SQUAD FLAME METER (The Hero Card) */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                Daily Momentum
              </span>
              <h3 className="text-xl font-bold text-slate-800 italic tracking-tight">Squad Flame Meter</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-3xl font-black text-orange-600 italic leading-none">
                {finishedCount}/{members.length}
              </span>
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">Ignited</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* The Animated Flame Bar Container */}
            <div className="h-7 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1 shadow-inner relative">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden flex items-center ${
                  progressPercent > 0 ? "flame-gradient-active animate-flame-pulse" : "bg-slate-200"
                }`}
                style={{ width: `${progressPercent}%` }}
              >
                {/* Shimmer Effect overlay */}
                {progressPercent > 0 && <div className="shimmer-line absolute inset-0" />}
                
                {/* Internal Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-bold tracking-tight italic">
              {progressPercent === 100 
                ? "🔥 THE SQUAD IS RADIANT. MAX INTENSITY ACHIEVED." 
                : "The flame is low. We need more focus to ignite the streak!"}
            </p>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      </div>

      {/* Member Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div 
            key={member.id} 
            className={`p-6 rounded-3xl border transition-all duration-500 flex items-center justify-between relative overflow-hidden ${
              member.hasFinishedToday 
              ? "border-orange-200 shadow-xl shadow-orange-100/50 bg-white" 
              : "bg-white border-slate-100 shadow-sm"
            }`}
          >
            {/* The Glowing Edge Gradient */}
            {member.hasFinishedToday && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-100/60 via-white/0 to-white/0 z-0 animate-in fade-in duration-1000" />
            )}

            <div className="flex items-center justify-between w-full relative z-10">
              <div className="flex items-center gap-4">
                
                {/* Avatar / Photo Container */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 ${
                  member.hasFinishedToday 
                  ? "bg-orange-600 text-white scale-105 shadow-md shadow-orange-200" 
                  : "bg-slate-100 text-slate-400"
                }`}>
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User size={24} />
                  )}
                </div>

                <div>
                  <p className="font-bold text-slate-800">{member.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    <Clock size={10} /> {member.totalMinutes}m Lifetime
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              {member.hasFinishedToday ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-25" />
                    <Flame className="text-orange-600 fill-current relative z-10" size={28} />
                  </div>
                  <span className="text-[8px] font-black text-orange-600 uppercase tracking-tighter">On Fire</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 opacity-20">
                  <Flame className="text-slate-400" size={28} />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Waiting</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}