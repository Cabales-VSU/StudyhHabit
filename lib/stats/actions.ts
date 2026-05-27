import { supabase } from "../supabase/client";

/**
 * Fetches general profile stats (minutes/streaks), the last 5 sessions, 
 * and calculates the true lifetime total minutes.
 */
export async function getUserStats(userId: string) {
  // 1. Get profile data (Still needed for the streak!)
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

  // 3. GET ALL SESSIONS TO CALCULATE REAL LIFETIME MINUTES
  const { data: allSessions, error: allSessionsError } = await supabase
    .from("study_sessions")
    .select("duration_minutes")
    .eq("user_id", userId);

  if (allSessionsError) throw allSessionsError;

  // Reduce the array to get the true sum of all logged minutes
  const calculated_total = allSessions?.reduce((sum, session) => {
    return sum + (session.duration_minutes || 0);
  }, 0) || 0;

  return {
    profile,
    sessions,
    calculated_total // Passing the newly calculated total to the frontend
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