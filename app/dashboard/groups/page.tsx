"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Users, Plus, Hash, Flame, LogOut, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { getUserGroups, leaveGroup, joinGroup, createGroup } from "@/lib/groups/actions";

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [joinId, setJoinId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const userGroups = await getUserGroups(user.id);
          setGroups(userGroups || []);
        }
      } catch (err) {
        console.error("Error loading groups:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleJoin = async () => {
    if (!joinId || !user) return;
    setIsSubmitting(true);
    try {
      await joinGroup(joinId, user.id);
      const updated = await getUserGroups(user.id);
      setGroups(updated);
      setShowModal(false);
      setJoinId("");
    } catch (err: any) {
      alert(err.message || "Could not join group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (!newGroupName || !user) return;
    setIsSubmitting(true);
    try {
      await createGroup(newGroupName, user.id);
      const updated = await getUserGroups(user.id);
      setGroups(updated);
      setShowModal(false);
      setNewGroupName("");
    } catch (err: any) {
      alert("Error creating group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeave = async (groupId: string, name: string) => {
    if (confirm(`Are you sure you want to leave ${name}?`)) {
      if (user) {
        await leaveGroup(groupId, user.id);
        setGroups(groups.filter(g => g.id !== groupId));
      }
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Syncing Teams...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Your Groups</h2>
          <p className="text-slate-500 font-medium">Manage your collective study streaks.</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 py-7 font-bold shadow-lg shadow-orange-100 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} /> Create or Join
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Groups Yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm">
            Join a group or create one to start your collective streak.
          </p>
          <Button onClick={() => setShowModal(true)} variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold">
            Get Started
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-[32px] p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/20 hover:border-orange-200 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Users className="text-orange-600" size={24} />
                </div>
                
                {/* Streak Badge with pulsing flame */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-wider relative overflow-hidden">
                   <div className="absolute inset-0 bg-white/40 animate-pulse" />
                   <Flame size={14} className="fill-current relative z-10" /> 
                   <span className="relative z-10">{group.group_streak} Day Streak</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">{group.name}</h3>
              <p className="text-[10px] font-mono text-slate-400 mb-6 uppercase tracking-tight">
                ID: {group.id.slice(0, 8)}...
              </p>
              
              <div className="flex items-center gap-2">
                <Link 
                  href={`/dashboard/groups/${group.id}`}
                  className="flex-1 bg-slate-500 text-white font-bold py-3 rounded-xl text-[10px] uppercase transition-all flex items-center justify-center gap-2 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-200"
                >
                  View Pulse <ArrowRight size={14} />
                </Link>
                <button 
                  onClick={() => handleLeave(group.id, group.name)}
                  className="px-4 py-3 text-slate-300 hover:text-red-500 transition-colors"
                  title="Leave Group"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Join/Create */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Groups</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Join with ID</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InputField 
                      placeholder="Enter Group ID" 
                      icon={<Hash size={18} />} 
                      value={joinId} 
                      onChange={(e) => setJoinId(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleJoin} 
                    disabled={isSubmitting || !joinId}
                    className="bg-slate-900 text-white h-14 rounded-2xl px-6 font-bold hover:bg-orange-600 transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Join"}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-300 bg-white px-4 tracking-[0.2em]">OR</div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest">Create New Team</label>
                <InputField 
                  placeholder="e.g. VSU Study Squad" 
                  icon={<Plus size={18} />} 
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Button 
                  onClick={handleCreate} 
                  disabled={isSubmitting || !newGroupName}
                  className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white h-15 rounded-2xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Start New Group"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}