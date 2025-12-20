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

      // 1. Check if customer exists by customer_id
      let { data: customer } = await supabase
        .from("customers")
        .select("customer_id, email")
        .eq("customer_id", payload.data?.customerId)
        .single();

      if (!customer) {
        // Check if customer exists by email
        const customerEmail = email || `${payload.data.customerId}@example.com`;

        const { data: existingCustomerByEmail } = await supabase
          .from("customers")
          .select("customer_id, email")
          .eq("email", customerEmail)
          .single();

        if (existingCustomerByEmail) {
          // Update existing customer with new customer_id
          const { data: updatedCustomer, error: updateError } = await supabase
            .from("customers")
            .update({
              customer_id: payload.data?.customerId,
              updated_at: new Date().toISOString(),
            })
            .eq("email", customerEmail)
            .select("customer_id, email")
            .single();

          if (updateError) {
            console.error("Failed to update customer:", updateError);
            return;
          }

          customer = updatedCustomer;
        } else {
          // Create new customer
          const { data: newCustomer, error: insertError } = await supabase
            .from("customers")
            .insert({
              customer_id: payload.data?.customerId,
              email: customerEmail,
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
      }

      // 2. Upsert subscription
      await supabase.from("subscriptions").upsert(
        {
          subscription_id: payload.data.id,
          subscription_status: payload.data.status || "active",
          product_id: payload.data?.productId,
          price_id: payload.data.prices?.[0]?.id || null,
          customer_id: customer.customer_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          end_date: payload.data.currentPeriodEnd,
        },
        { onConflict: "subscription_id" }
      );

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        console.error("No profile found for email:", email);
        return;
      }

      // Get existing token usage for this user
      const { data: existingTokenUsage } = await supabase
        .from("token_usage")
        .select("token_limit, tokens_used")
        .eq("user_id", profile.id)
        .single();

      // Calculate new token limit (add to existing limit if upgrading)
      let newTokenLimit = tokenLimit;
      if (existingTokenUsage && existingTokenUsage.token_limit) {
        // If user already has a limit set, add the new tokens to their existing allocation
        // This handles cases where a user upgrades their plan
        newTokenLimit = Math.max(tokenLimit, existingTokenUsage.token_limit);
      }

      await supabase.from("token_usage").upsert(
        {
          user_id: profile.id,
          token_limit: newTokenLimit,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (err) {
      console.error("Subscription active error:", err);
    }
  },

  onSubscriptionRevoked: async (payload) => {
    try {
      const supabase = await createClient();
      const email = payload.data.customer?.email;
      const month = getMonthKey();

      await supabase
        .from("subscriptions")
        .update({
          subscription_status: "revoked",
          updated_at: new Date().toISOString(),
        })
        .eq("subscription_id", payload.data.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        console.error("No profile found for email:", email);
        return;
      }

      // Get existing token usage for this user and month
      const { data: existingTokenUsage } = await supabase
        .from("token_usage")
        .select("token_limit")
        .eq("user_id", profile.id)
        .single();

      // Set token limit to default, but don't reduce below existing limit
      // This prevents reducing tokens if user had a higher limit before
      let newTokenLimit = TOKEN_AMOUNTS.default;
      if (existingTokenUsage && existingTokenUsage.token_limit) {
        newTokenLimit = Math.max(
          TOKEN_AMOUNTS.default,
          existingTokenUsage.token_limit
        );
      }

      await supabase
        .from("token_usage")
        .update({
          token_limit: newTokenLimit,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.id);
    } catch (err) {
      console.error("Subscription revoked error:", err);
    }
  },

  onSubscriptionCanceled: async (payload) => {
    try {
      const supabase = await createClient();
      const email = payload.data.customer?.email;
      const month = getMonthKey();
      await supabase
        .from("subscriptions")
        .update({
          subscription_status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("subscription_id", payload.data.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        console.error("No profile found for email:", email);
        return;
      }

      // Get existing token usage for this user
      const { data: existingTokenUsage } = await supabase
        .from("token_usage")
        .select("token_limit")
        .eq("user_id", profile.id)
        .single();

      // Set token limit to default, but don't reduce below existing limit
      // This prevents reducing tokens if user had a higher limit before
      let newTokenLimit = TOKEN_AMOUNTS.default;
      if (existingTokenUsage && existingTokenUsage.token_limit) {
        newTokenLimit = Math.max(
          TOKEN_AMOUNTS.default,
          existingTokenUsage.token_limit
        );
      }

      await supabase
        .from("token_usage")
        .update({
          token_limit: newTokenLimit,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", profile.id);
    } catch (err) {
      console.error("Subscription canceled error:", err);
    }
  },
});
