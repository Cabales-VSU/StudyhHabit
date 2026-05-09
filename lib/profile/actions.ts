import { supabase } from "../supabase/client";

export async function updateProfile(userId: string, updates: {
  username: string;
  display_name: string;
  avatar_url: string;
}) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
  return { success: true };
}