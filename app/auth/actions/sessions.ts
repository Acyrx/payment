"use server";

import { createClient } from "@/lib/supabase/server";
import {
  generateSessionToken,
  parseUserAgent,
  getLocationFromHeaders,
  getClientIP,
} from "@/lib/session-utils";
import { headers } from "next/headers";

export async function trackSession(userId: string) {
  const supabase = await createClient();
  const headersList = await headers();

  const userAgent = headersList.get("user-agent") || "";
  const ipAddress = getClientIP(headersList);
  const { country, city, latitude, longitude } =
    getLocationFromHeaders(headersList);
  const { browser, browserVersion, os, osVersion, deviceType } =
    parseUserAgent(userAgent);
  const sessionToken = generateSessionToken();

  const { data: session, error } = await supabase.from("user_sessions").insert({
    user_id: userId,
    session_token: sessionToken,
    ip_address: ipAddress,
    user_agent: userAgent,
    browser,
    browser_version: browserVersion,
    os,
    os_version: osVersion,
    device_type: deviceType,
    country,
    city,
    latitude,
    longitude,
    is_current: true,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  });

  if (error) {
    console.error("Session tracking error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, session };
}

export async function getSessions() {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: sessions, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", user.user.id)
    .eq("revoked", false)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, sessions };
}

export async function revokeSession(sessionId: string) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: session } = await supabase
    .from("user_sessions")
    .select("user_id")
    .eq("id", sessionId)
    .maybeSingle();

  if (!session || session.user_id !== user.user.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("user_sessions")
    .update({ revoked: true, revoked_at: new Date().toISOString() })
    .eq("id", sessionId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Session revoked successfully" };
}

export async function revokeAllOtherSessions() {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return { success: false, error: "Not authenticated" };
  }

  const headersList = await headers();
  const currentSessionToken = headersList.get("session-token");

  const { error } = await supabase
    .from("user_sessions")
    .update({ revoked: true, revoked_at: new Date().toISOString() })
    .eq("user_id", user.user.id)
    .neq("session_token", currentSessionToken || "");

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "All other sessions revoked successfully" };
}
