import { polar } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const polarProducts = await polar.products.list({
      isArchived: false,
    });

    const items = polarProducts.result.items ?? [];

    for (const product of items) {
      const prices = product.prices ?? [];

      for (const price of prices) {
        // ✅ ONLY fixed recurring prices
        if (price.type !== "recurring" || price.amountType !== "fixed") {
          continue;
        }

        await supabase.from("products").upsert(
          {
            polar_product_id: product.id,
            polar_price_id: price.id, // ⭐ IMPORTANT
            name: product.name,
            description: product.description || "",
            price_amount: price.priceAmount,
            price_currency: price.priceCurrency,
            billing_interval: price.recurringInterval, // month | year
            is_archived: product.isArchived ?? false,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "polar_price_id",
          }
        );
      }
    }

    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    console.error("[polar-sync] Error:", error);
    return NextResponse.json(
      { error: error.message ?? String(error) },
      { status: 500 }
    );
  }
}
