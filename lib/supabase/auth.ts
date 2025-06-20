import { SupabaseClient, User } from "@supabase/supabase-js";

type UpdateUserData = {
  email?: string;
  data?: Record<string, unknown>;
};

type SignUpData = {
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
};

/**
 * Check if a user is currently authenticated
 */
export async function isAuthenticated(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(
  supabase: SupabaseClient,
): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Send a magic link to the user's email for passwordless sign-in
 * @param supabase - The Supabase client
 * @param email - The user's email address
 * @param redirect - (optional) The URL to redirect to after sign-in e.g. /clikable
 */
export async function signInWithMagicLink(
  supabase: SupabaseClient,
  email: string,
  {
    redirect,
  }: {
    redirect?: string;
  } = {},
) {
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectToUrl = redirect
    ? `${baseURL}/auth/callback?redirect=${redirect}`
    : `${baseURL}/auth/callback`;
  const result = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectToUrl,
    },
  });

  return result;
}

/**
 * Sign in with a third-party provider
 */
export async function signInWithProvider(
  supabase: SupabaseClient,
  provider: "google" | "github" | "twitter",
) {
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

/**
 * Sign out the current user
 */
export async function signOut(supabase: SupabaseClient) {
  return supabase.auth.signOut();
}

/**
 * Send a password reset email to the specified email address
 */
export async function resetPassword(supabase: SupabaseClient, email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
}

/**
 * Update user profile data
 */
export async function updateUserProfile(
  supabase: SupabaseClient,
  userData: UpdateUserData,
) {
  return supabase.auth.updateUser(userData);
}

/**
 * Send a verification email to confirm a new email address
 */
export async function sendVerificationEmail(
  supabase: SupabaseClient,
  email: string,
) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

/**
 * Refresh the current session
 */
export async function refreshSession(supabase: SupabaseClient) {
  return supabase.auth.refreshSession();
}

/**
 * Get the current session if it exists
 */
export async function getSession(supabase: SupabaseClient) {
  return supabase.auth.getSession();
}

/**
 * Exchange an auth code for a session (used in OAuth flows)
 */
export async function exchangeCodeForSession(
  supabase: SupabaseClient,
  code: string,
) {
  return supabase.auth.exchangeCodeForSession(code);
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(supabase: SupabaseClient, data: SignUpData) {
  return supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: data.metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

/**
 * Update the user's password with a token from a password reset email
 */
export async function updatePasswordWithToken(
  supabase: SupabaseClient,
  newPassword: string,
) {
  return supabase.auth.updateUser({ password: newPassword });
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string,
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}
