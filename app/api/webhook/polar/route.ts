import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@/lib/supabase/server";

const TOKEN_AMOUNTS: Record<string, number> = {
  [process.env.POLAR_BASIC_PRODUCT_ID!]: 500000,
  [process.env.POLAR_PRO_PRODUCT_ID!]: 1000000,
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
        TOKEN_AMOUNTS[payload.data.productId] || TOKEN_AMOUNTS.default;

      /** 1. Find customer */
      const { data: customer } = await supabase
        .from("customers")
        .select("id, auth_id")
        .eq("polar_customer_id", payload.data.customerId)
        .single();

      if (!customer?.auth_id) {
        throw new Error("Customer or auth_id not found");
      }

      /** 2. Upsert monthly token usage */
      await supabase.from("token_usage").upsert(
        {
          user_id: customer.auth_id,
          month,
          token_limit: tokenLimit,
          tokens_used: 0,
          last_reset_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,month",
        }
      );

      /** 3. Upsert subscription */
      await supabase.from("subscriptions").upsert(
        {
          customer_id: customer.id,
          polar_subscription_id: payload.data.id,
          polar_product_id: payload.data.productId,
          status: "active",
          current_period_start: payload.data.currentPeriodStart,
          current_period_end: payload.data.currentPeriodEnd,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "polar_subscription_id" }
      );

      /** 4. Mark customer active */
      await supabase
        .from("customers")
        .update({
          subscription_status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", customer.id);
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
          status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("polar_subscription_id", payload.data.id);

      await supabase
        .from("customers")
        .update({
          subscription_status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("polar_customer_id", payload.data.customerId);
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
          status: "canceled",
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq("polar_subscription_id", payload.data.id);

      await supabase
        .from("customers")
        .update({
          subscription_status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("polar_customer_id", payload.data.customerId);
    } catch (err) {
      console.error("Subscription canceled error:", err);
    }
  },
});
