'use client';
import { createClient } from "../supabase/client";

export async function getUserWithProfile(id: string) {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", id)
  .single();

  return {profile, profileError};
}


export async function loginUser(email: string, password: string) {
  console.log("1. Starting loginUser for email:", email);
  const supabase = createClient();

  console.log("2. Attempting signInWithPassword...");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  console.log("3. signInWithPassword result:", { 
    hasData: !!data, 
    hasUser: !!data?.user,
    error: error?.message,
    errorStatus: error?.status
  });

  if (error) {
    console.log("4. Login error detected:", error.message);
    return { user: null, error, requiresMFA: false };
  }

  console.log("5. Sign in successful, checking MFA...");
  console.log("User ID:", data.user?.id);

  const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  
  console.log("6. MFA Assurance Level result:", {
    aalData,
    aalError: aalError?.message,
    currentLevel: aalData?.currentLevel,
    nextLevel: aalData?.nextLevel
  });
  
  if (aalData && aalData.nextLevel === "aal2" && aalData.nextLevel !== aalData.currentLevel) {
    console.log("7. MFA upgrade required");
    
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    
    console.log("8. List factors result:", {
      hasFactors: !!factorsData,
      totpCount: factorsData?.totp?.length || 0,
      factorsError: factorsError?.message
    });
    
    const totpFactor = factorsData?.totp?.[0];
    
    if (totpFactor) {
      console.log("9. TOTP factor found, creating challenge for factor:", totpFactor.id);
      
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });
      
      console.log("10. Challenge result:", {
        hasChallengeData: !!challengeData,
        challengeId: challengeData?.id,
        challengeError: challengeError?.message
      });
      
      if (challengeError) {
        console.log("11. Challenge error:", challengeError.message);
        return { user: null, error: challengeError, requiresMFA: false };
      }
      
      console.log("12. MFA required - returning challenge");
      return {
        user: data.user,
        requiresMFA: true,
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        error: null,
      };
    } else {
      console.log("9b. No TOTP factor found");
    }
  } else {
    console.log("7b. No MFA required");
  }

  console.log("13. Login complete - no MFA needed");
  return { user: data.user, error: null, requiresMFA: false };
}

export async function signUpUser(email: string,password: string,username: string) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login?verified=true`,
      data: { "display_name": username },

    },
  });
}


export async function LoginWithGoogle(nextRoute: string) {
  const supabase = createClient();
    
  const redirectTo = `${window.location.origin}/auth/callback?next=${nextRoute}`;

  return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
  });

}

export async function forgetPassword(email: string) {
  const supabase = createClient();

  return supabase.auth.resetPasswordForEmail(email,
    {redirectTo: `${window.location.origin}/update-password`}
  );

}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  return supabase.auth.updateUser(
    { password: newPassword }
  );
}

export async function LogOutUser()
{
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function verifyMFA(factorId: string, challengeId: string, code: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
  if (error) return { error };
  const { profile, profileError } = await getUserWithProfile(data.user.id);
  return { user: data.user, profile, profileError, error: null };
}

export async function resendEmailConfirmation(UserEmail: string) {
  const supabase = createClient();

  return supabase.auth.resend({ 
    type: "signup", 
    email:UserEmail,
    options: {
      emailRedirectTo: `${window.location.origin}/sign-up/?verified=true`
    }
  });
}
