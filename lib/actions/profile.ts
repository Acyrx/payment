"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export interface Profile {
  id: string;
  email: string;
  name: string;
  class: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  plan: string;
}

export async function getProfile() {
  const supabase = await createClient();
  const user = await getUser(); // contains id + email

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    email: user.email, // merge email here
  };
}

export async function updateProfile(updates: Partial<Profile>) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}
