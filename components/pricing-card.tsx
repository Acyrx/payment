"use client";
import { Button } from "@/components/ui/button";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  features: string[];
  featured?: boolean;
  icon?: LucideIcon;
  description?: string;
}

export function PricingCard({
  name,
  price,
  period,
  features,
  featured,
  icon: Icon,
  description,
}: PricingCardProps) {
  return (
    <>
      <div
        className={cn(
          "relative rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1",
          featured
            ? // 💫 Featured card styling (uses accent + primary)
              `from-primary/15 via-accent/10 to-primary/5 border-primary/50 shadow-primary/20
                bg-gradient-to-br shadow-2xl`
            : // 🧱 Regular card styling (uses card + border)
              `bg-card border-border hover:border-primary/40 hover:shadow-primary/20
                hover:shadow-lg`,
        )}
      >
        {featured && (
          <div
            className="bg-accent text-accent-foreground shadow-accent/30 absolute -top-3 left-1/2
              -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold tracking-wide
              uppercase shadow-md"
          >
            Most Popular
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            {Icon && (
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg border shadow-md",
                  featured
                    ? "bg-primary/25 border-primary/50 shadow-primary/30"
                    : "bg-primary/15 border-primary/30 shadow-primary/15",
                )}
              >
                <Icon className="text-primary h-6 w-6" />
              </div>
            )}

            <div>
              <h3 className="text-foreground text-xl font-bold">{name}</h3>
              {description && (
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-4xl font-bold tracking-tight",
                  featured
                    ? "from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent"
                    : "text-foreground",
                )}
              >
                ${price}
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                /{period}
              </span>
            </div>
          </div>

          <Link href="/auth">
            <Button
              className={cn(
                "w-full rounded-lg font-semibold transition-all",
                featured
                  ? `bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/40
                    shadow-md`
                  : `bg-primary/90 text-primary-foreground hover:bg-primary shadow-primary/30
                    shadow-md`,
              )}
            >
              Get Started with {name}
            </Button>
          </Link>

          <ul className="space-y-3 pt-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3"
              >
                <Check className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-foreground/90 text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
