'use client';

import { supabase } from "../supabase/client";

// 1. Login User (Supports standard login and prepares for MFA)
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  // Handle MFA if enabled
  if (data?.user && !error) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    if (factors?.all && factors.all.length > 0) {
      const factor = factors.all[0];
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
      return { requiresMFA: true, factorId: factor.id, challengeId: challenge?.id, error: challengeError };
    }
  }
  
  return { user: data?.user, error };
}

// 2. Sign Up User (Updated to match the username/display_name logic)
export async function signUpUser(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: username },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

// 3. Forget Password
export async function forgetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  return { error };
}

// 4. Update Password (For the reset flow)
export async function updatePassword(new_password: string) {
  const { error } = await supabase.auth.updateUser({ password: new_password });
  return { error };
}

// 5. Verify MFA
export async function verifyMFA(factorId: string, challengeId: string, code: string) {
  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });
  return { data, error };
}

// 6. Resend Confirmation
export async function resendEmailConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  return { error };
}

// 7. Google Login
export async function LoginWithGoogle(nextRoute: string = '/dashboard') {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${nextRoute}`,
    },
  });
}

// 8. Logout User
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
}