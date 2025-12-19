import { createClient, getUser } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/lib/polar";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = req.nextUrl.searchParams.get("email");
    if (!email) {
      return NextResponse.json({ subscriptions: [] });
    }

    // Get customer by email
    const { data: customer } = await supabase
      .from("customers")
      .select("customer_id")
      .eq("email", email)
      .single();

    if (!customer) return NextResponse.json({ subscriptions: [] });

    // Get subscriptions
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("customer_id", customer.customer_id);

    // Fetch Polar products **server-side**
    const polarProducts = await polar.products.list({ isArchived: false });
    // Map subscriptions to products safely
    const subscriptionsWithProducts = (subscriptions || []).map((sub: any) => {
      const product = polarProducts?.result.items.find(
        (p: any) => p.id === sub.product_id
      );
      return { ...sub, product };
    });

    return NextResponse.json({ subscriptions: subscriptionsWithProducts });
  } catch (err: any) {
    console.error("Error fetching subscriptions:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
