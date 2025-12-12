import { PricingSection } from "@/features/account/components/pricing-section";
import {
  getCustomerPortalUrl,
  getSubscriptionProducts,
} from "@/features/account/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { hasSubscriptionEnded } from "@/lib/supabase/database/subscriptions";
import { getCustomerId } from "@/lib/supabase/database/users";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const products = await getSubscriptionProducts();
  const supabase = await createClient();

  // Load user
  const user = await getCurrentUser(supabase);
  if (!user) {
    redirect("/login");
  }

  // Load customerId
  const customerId = await getCustomerId(supabase, user.id);
  if (!customerId) {
    // User exists but no customer record → treat like no subscription
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <PricingSection products={products} />
      </div>
    );
  }

  // Check subscription
  const hasEnded = await hasSubscriptionEnded(supabase, customerId);

  // Portal URL
  const portalUrl = await getCustomerPortalUrl();

  return (
    <div className="flex flex-col items-center justify-center pt-10">
      {hasEnded ? (
        <PricingSection products={products} />
      ) : (
        <div>
          {portalUrl ? (
            <Link href={portalUrl}>Go to portal</Link>
          ) : (
            <p>Subscription is active</p>
          )}
        </div>
      )}
    </div>
  );
}
