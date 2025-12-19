import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@/lib/supabase/admin"; // server-side client

const TOKEN_AMOUNTS: Record<string, number> = {
  [process.env.POLAR_STANDARD_PRODUCT_ID_MONTHLY!]: 500000,
  [process.env.POLAR_PREMIUM_PRODUCT_ID_MONTHLY!]: 1000000,
  [process.env.POLAR_STANDARD_PRODUCT_ID_YEAR!]: 500000,
  [process.env.POLAR_PREMIUM_PRODUCT_ID_YEAR!]: 1000000,
  default: 500,
};

const getMonthKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionActive: async (payload) => {
    try {
      const supabase = await createClient();
      const month = getMonthKey();
      const tokenLimit =
        TOKEN_AMOUNTS[payload.data?.productId] || TOKEN_AMOUNTS.default;
      const email = payload.data.customer?.email;

      // 1. Upsert customer (no auth_id)
      let { data: customer } = await supabase
        .from("customers")
        .select("customer_id, email")
        .eq("customer_id", payload.data?.customerId)
        .single();

      if (!customer) {
        const { data: newCustomer, error: insertError } = await supabase
          .from("customers")
          .insert({
            customer_id: payload.data?.customerId,
            email: email || `${payload.data.customerId}@example.com`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("customer_id, email")
          .single();

        if (insertError) {
          console.error("Failed to create customer:", insertError);
          return;
        }

        customer = newCustomer;
      }

      // 2. Upsert subscription
      await supabase.from("subscriptions").upsert(
        {
          subscription_id: payload.data.id,
          subscription_status: payload.data.status || "active",
          product_id: payload.data?.productId,
          price_id: payload.data.prices?.[0]?.id || null,
          subscription_end: payload.data.endedAt,
          current_period_start: payload.data.currentPeriodStart,
          customer_id: customer.customer_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "subscription_id" }
      );

      // 3. Upsert token usage only if you have a user_id (optional)
      // Skipped since no auth_id
    } catch (err) {
      console.error("Subscription active error:", err);
    }
  },

  onSubscriptionRevoked: async (payload) => {
    try {
      const supabase = await createClient();
      await supabase
        .from("subscriptions")
        .update({
          subscription_status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("subscription_id", payload.data.id);
    } catch (err) {
      console.error("Subscription revoked error:", err);
    }
  },

  onSubscriptionCanceled: async (payload) => {
    try {
      const supabase = await createClient();
      await supabase
        .from("subscriptions")
        .update({
          subscription_status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("subscription_id", payload.data.id);
    } catch (err) {
      console.error("Subscription canceled error:", err);
    }
  },
});
