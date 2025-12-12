"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  checkSignupLimit,
  checkSigninLimit,
  checkPasswordResetLimit,
  checkRateLimit,
} from "@/lib/rate-limiter";
import { trackSession } from "@/app/auth/actions/sessions";
import { headers } from "next/headers";

export interface AuthResult {
  success: boolean;
  error?: string;
  rateLimited?: boolean;
  remaining?: number;
  resetIn?: number;
}

export async function signin(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return {
      success: false,
      error: { message: "Email and password are required." },
    };
  }

  const { allowed, resetAfter } = await checkSigninLimit(email);

  if (!allowed) {
    return {
      success: false,
      error: {
        message: `Too many login attempts. Please try again in ${resetAfter} seconds.`,
        code: "RATE_LIMIT_EXCEEDED",
      },
    };
  }

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    return {
      success: false,
      error: { message: signInError.message || "Invalid credentials." },
    };
  }

  if (signInData.user) {
    await trackSession(signInData.user.id);
  }

  return {
    success: true,
    data: signInData,
    message: "Signed in successfully!",
  };
}

export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error };
  }

  return { success: true };
}

export async function signinWithGithub() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${
        process.env.SITE_URL || "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error };
  }

  redirect(data.url);
}

export async function signinWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        process.env.SITE_URL || "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error };
  }

  redirect(data.url);
}

export async function checkAuthRateLimit(): Promise<AuthResult> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  const rateLimitResult = await checkRateLimit(ip);

  if (!rateLimitResult.success) {
    return {
      success: false,
      error: `Too many attempts. Please try again in ${formatTime(
        rateLimitResult.resetIn,
      )}.`,
      rateLimited: true,
      remaining: rateLimitResult.remaining,
      resetIn: rateLimitResult.resetIn,
    };
  }

  return {
    success: true,
    remaining: rateLimitResult.remaining,
    resetIn: rateLimitResult.resetIn,
  };
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}
