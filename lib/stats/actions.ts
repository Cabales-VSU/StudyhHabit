import { supabase } from "../supabase/client";

/**
 * Fetches general profile stats (minutes/streaks) and the last 5 sessions.
 */
export async function getUserStats(userId: string) {
  // 1. Get profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("overall_study_minutes, current_streak")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  // 2. Get the last 5 sessions for the history list
  const { data: sessions, error: sessionError } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (sessionError) throw sessionError;

  return {
    profile,
    sessions
  };
}

/**
 * Fetches and groups study minutes by day for the last 7 days.
 */
export async function getWeeklyStats(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: sessions, error } = await supabase
    .from("study_sessions")
    .select("duration_minutes, created_at")
    .eq("user_id", userId)
    .gte("created_at", sevenDaysAgo.toISOString());

  if (error) throw error;

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = days.map((day) => ({ day, minutes: 0 }));

  sessions.forEach((session) => {
    const dayIndex = new Date(session.created_at).getDay();
    weeklyData[dayIndex].minutes += session.duration_minutes;
  });

  const todayIndex = new Date().getDay();
  const orderedData = [
    ...weeklyData.slice(todayIndex + 1),
    ...weeklyData.slice(0, todayIndex + 1),
  ];

  return orderedData;
}