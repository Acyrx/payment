import { createClient, getUser } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user?.id) {
    throw new Error("You must be logged in to create a companion");
  }
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get customer
    const { data: customer } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email)
      .single();

    if (!customer) {
      return NextResponse.json({ subscriptions: [] }, { status: 200 });
    }

    // Get subscriptions with product details
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(
        `
        *,
        products:polar_product_id (
          name,
          description,
          price_amount,
          price_currency
        )
      `
      )
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { subscriptions: subscriptions || [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in subscriptions route:", error);
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
