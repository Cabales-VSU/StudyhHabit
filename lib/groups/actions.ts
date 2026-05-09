import { supabase } from "../supabase/client";

/**
 * Fetches the "Pulse" of a group: all members and their status for today.
 */
export async function getGroupPulse(groupId: string) {
  const { data: members, error: memberError } = await supabase
    .from("group_members")
    .select(`
      user_id,
      profiles (
        username,
        avatar_url,
        overall_study_minutes
      )
    `)
    .eq("group_id", groupId);

  if (memberError) throw memberError;

  const now = new Date();
  const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const pulseData = await Promise.all(members.map(async (m: any) => {
    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("id")
      .eq("user_id", m.user_id)
      .gte("created_at", startOfToday.toISOString())
      .gte("duration_minutes", 30);

    const profile = m.profiles || { 
      username: "Active Scholar", 
      avatar_url: "", 
      overall_study_minutes: 0 
    };

    return {
      id: m.user_id,
      name: profile.username || "Active Scholar",
      avatar: profile.avatar_url || "",
      hasFinishedToday: (sessions?.length || 0) > 0,
      totalMinutes: profile.overall_study_minutes || 0
    };
  }));

  return pulseData;
}

/**
 * Fetches all groups a specific user belongs to.
 */
export async function getUserGroups(userId: string) {
  const { data: userGroups, error: joinError } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId);

  if (joinError) throw joinError;
  if (!userGroups || userGroups.length === 0) return [];

  const groupIds = userGroups.map(ug => ug.group_id);

  const { data: groups, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .in("id", groupIds);

  if (groupError) throw groupError;
  return groups;
}

/**
 * Allows a user to join a group using its ID.
 */
export async function joinGroup(groupId: string, userId: string) {
  const { error } = await supabase
    .from("group_members")
    .insert([{ group_id: groupId, user_id: userId }]);

  if (error) {
    if (error.code === '23505') throw new Error("You are already a member of this group.");
    throw new Error("Group not found or invalid ID.");
  }
  return { success: true };
}

/**
 * Creates a new group and automatically adds the creator as a member.
 */
export async function createGroup(name: string, userId: string) {
  // 1. Create the group
  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert([{ name, group_streak: 0 }])
    .select()
    .single();

  if (groupError) throw groupError;

  // 2. Add the creator to group_members
  const { error: memberError } = await supabase
    .from("group_members")
    .insert([{ group_id: group.id, user_id: userId }]);

  if (memberError) throw memberError;

  return group;
}

/**
 * Allows a user to leave a group.
 */
export async function leaveGroup(groupId: string, userId: string) {
  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) throw error;
  return { success: true };
}