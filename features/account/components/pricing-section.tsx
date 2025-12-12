import { PricingCard } from "./pricing-card";

interface Product {
  name: string;
  price_formatted: string;
  description: string;
  variant_id?: string;
  test_mode: boolean;
  [key: string]: any;
}

interface PricingSectionProps {
  products: Product[];
}

export function PricingSection({ products }: PricingSectionProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          No subscription plans available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground text-lg">
          Select the subscription that best fits your needs
        </p>
      </div>
      <div
        className={`grid gap-6 ${
          products.length === 1
            ? "mx-auto max-w-md"
            : products.length === 2
              ? "mx-auto max-w-4xl md:grid-cols-2"
              : "md:grid-cols-2 lg:grid-cols-3"
          }`}
      >
        {products.map((product, index) => (
          <PricingCard
            key={product.variant_id || index}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
