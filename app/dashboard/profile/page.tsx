"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/profile/actions";
import { User, AtSign, CreditCard, Save, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUsername(profile.username || "");
          setDisplayName(profile.display_name || "");
          setAvatarUrl(profile.avatar_url || "");
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // 1. Handle clicking the avatar
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 2. Handle file selection and convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1000000) { // 1MB Limit for Base64 storage
        alert("File is too large! Please choose an image under 1MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(user.id, {
        username,
        display_name: displayName,
        avatar_url: avatarUrl
      });
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Your Profile</h2>
        <p className="text-slate-500">Click the photo to change your look.</p>
      </div>

      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm space-y-10">
        
        {/* Clickable Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
          
          <div 
            onClick={handleAvatarClick}
            className="group relative cursor-pointer"
          >
            <div className="w-32 h-32 rounded-[40px] bg-orange-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl shadow-orange-100 transition-transform active:scale-95">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-orange-600" />
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[36px]">
                <Camera className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <InputField 
              placeholder="e.g. Milchzedek Cabales" 
              icon={<CreditCard size={18} />} 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              label={""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username (@)</label>
            <InputField 
              placeholder="username" 
              icon={<AtSign size={18} />} 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              label={""}
            />
          </div>
        </div>

        <Button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white h-16 rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
        </Button>
      </div>
    </div>
  );
}