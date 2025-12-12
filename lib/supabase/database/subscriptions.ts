import { SupabaseClient } from "@supabase/supabase-js";
export async function insertSubscription(
  supabase: SupabaseClient,
  {
    customerId,
    subscriptionId,
    productId,
    variantId,
    status,
    cancelled,
    renewsAt,
    endsAt,
    createdAt,
    updatedAt,
  }: {
    customerId: string;
    subscriptionId: number;
    productId: string;
    variantId: string;
    status: string;
    cancelled: boolean;
    renewsAt: string;
    endsAt: string | null;
    createdAt: string;
    updatedAt: string;
  },
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        customer_id: customerId,
        subscription_id: subscriptionId,
        product_id: productId,
        variant_id: variantId,
        status,
        cancelled,
        renews_at: renewsAt,
        ends_at: endsAt,
        created_at: createdAt,
        updated_at: updatedAt,
      },
      { onConflict: "customer_id" },
    )
    .select();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function hasSubscriptionEnded(
  supabase: SupabaseClient,
  customerId: string,
) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("ends_at")
    .eq("customer_id", customerId)
    .maybeSingle(); // safer than .single()

  if (error) {
    console.error("Supabase error in hasSubscriptionEnded:", error);
    return true; // assume ended if DB error
  }

  // No subscription row found
  if (!data) {
    return true; // treat as ended
  }

  // Subscription has no end date => still active
  if (data.ends_at === null) {
    return false;
  }

  const endDate = new Date(data.ends_at);
  const currentDate = new Date();

  return currentDate > endDate;
}

export async function getSubscriptionId(
  supabase: SupabaseClient,
  customerId: string,
) {
  console.log(customerId);

  const { data, error } = await supabase
    .from("subscriptions")
    .select("subscription_id")
    .eq("customer_id", customerId)
    .maybeSingle(); // safer than .single()

  if (error) {
    console.error("Supabase error in getSubscriptionId:", error);
    return null;
  }

  // No subscription row found
  if (!data) {
    return null;
  }

  return data.subscription_id;
}
