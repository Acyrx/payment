import Link from "next/link";
import { polar } from "@/lib/polar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  Code2,
  GraduationCap,
  Mic,
  MessageSquare,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export default async function Home() {
  const products = await polar.products.list({ isArchived: false });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const items = products.result.items;

  function getProductByNameAndInterval(
    products: any,
    name: string,
    interval: "month" | "year"
  ) {
    return products?.find(
      (p) =>
        p.name.toLowerCase().includes(name.toLowerCase()) &&
        p.prices?.some(
          (price) =>
            price.type === "recurring" && price.recurringInterval === interval
        )
    );
  }

  const standardMonthly = getProductByNameAndInterval(
    items,
    "standard",
    "month"
  );
  const standardYearly = getProductByNameAndInterval(items, "standard", "year");

  const premiumMonthly = getProductByNameAndInterval(items, "premium", "month");
  const premiumYearly = getProductByNameAndInterval(items, "premium", "year");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Image
                src="/images/acyrx2.png"
                alt="AI Logo"
                width={60}
                height={60}
                className="object-contain rounded-xl"
              />
            </div>
            <div>
              <span className="font-bold text-xl">Acyrx</span>
              <span className="text-xs text-muted-foreground ml-2">
                AI-Powered Editor
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge
            className="mb-6 px-4 py-1.5 bg-blue-100 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
            variant="secondary"
          >
            <Sparkles className="w-3 h-3 mr-1.5 inline" />
            AI-Powered Development Environment
          </Badge>
          <h1 className="text-6xl font-bold tracking-tight mb-6 text-balance bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Code Smarter with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Experience the future of coding with our VS Code-inspired editor
            powered by AI. Get instant help, learn faster, and build better
            applications.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Pricing Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="relative overflow-hidden border-2 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 right-0 bg-gradient-to-bl from-green-500/10 to-transparent w-32 h-32" />
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription className="text-base mt-2">
                  Perfect for getting started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">100 AI tokens</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">Basic AI model access</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">VS Code interface</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">Code library</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm">Community support</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {user ? (
                  <Link href="/dashboard" className="w-full">
                    <Button
                      className="w-full bg-transparent"
                      size="lg"
                      variant="outline"
                    >
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/sign-up" className="w-full">
                    <Button
                      className="w-full bg-transparent"
                      size="lg"
                      variant="outline"
                    >
                      Get Started
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>

            {/* Standard Tier */}
            {standardMonthly ? (
              <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-500/10 to-transparent w-40 h-40" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Popular
                  </Badge>
                  <CardTitle className="text-2xl">Standard</CardTitle>
                  <CardDescription className="text-base mt-2">
                    For serious developers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency:
                            standardMonthly.prices?.[0]?.priceCurrency || "USD",
                        }).format(
                          (standardMonthly.prices?.[0]?.priceAmount || 0) / 100
                        )}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">5,000 AI tokens/month</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">
                        <strong>Multiple AI models</strong> (GPT-4, Claude)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">
                        <strong>API integration</strong> (coming soon)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Voice assistance</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Learning journeys</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user ? (
                    <Link
                      href={`/api/checkout?products=${standardMonthly.id}&customerEmail=${user.email}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        size="lg"
                      >
                        Subscribe Now
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="w-full">
                      <Button
                        className="w-full bg-transparent"
                        size="lg"
                        variant="outline"
                      >
                        Login to Subscribe
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ) : null}

            {premiumMonthly ? (
              <Card className="relative overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-indigo-500/10 to-transparent w-40 h-40" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    Pro
                  </Badge>
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Unlimited possibilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency:
                            premiumMonthly.prices?.[0]?.priceCurrency || "USD",
                        }).format(
                          (premiumMonthly.prices?.[0]?.priceAmount || 0) / 100
                        )}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">
                        <strong>Unlimited AI tokens</strong>
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">
                        <strong>All AI models</strong> (GPT-4, Claude, Gemini,
                        Llama)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">Advanced API integration</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">All features included</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">Early access to features</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user ? (
                    <Link
                      href={`/api/checkout?products=${premiumMonthly.id}&customerEmail=${user.email}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        size="lg"
                      >
                        Subscribe Now
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="w-full">
                      <Button
                        className="w-full bg-transparent"
                        size="lg"
                        variant="outline"
                      >
                        Login to Subscribe
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ) : null}
            {/* Premium Tier */}

            {standardYearly ? (
              <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-500/10 to-transparent w-40 h-40" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Popular
                  </Badge>
                  <CardTitle className="text-2xl">Standard</CardTitle>
                  <CardDescription className="text-base mt-2">
                    For serious developers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency:
                            standardYearly.prices?.[0]?.priceCurrency || "USD",
                        }).format(
                          (standardYearly.prices?.[0]?.priceAmount || 0) / 100
                        )}
                      </span>
                      <span className="text-muted-foreground">/year</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">5,000 AI tokens/month</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">
                        <strong>Multiple AI models</strong> (GPT-4, Claude)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">
                        <strong>API integration</strong> (coming soon)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Voice assistance</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Learning journeys</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user ? (
                    <Link
                      href={`/api/checkout?products=${standardYearly.id}&customerEmail=${user.email}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        size="lg"
                      >
                        Subscribe Now
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="w-full">
                      <Button
                        className="w-full bg-transparent"
                        size="lg"
                        variant="outline"
                      >
                        Login to Subscribe
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ) : null}

            {premiumYearly ? (
              <Card className="relative overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-indigo-500/10 to-transparent w-40 h-40" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    Pro
                  </Badge>
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Unlimited possibilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency:
                            premiumYearly.prices?.[0]?.priceCurrency || "USD",
                        }).format(
                          (premiumYearly.prices?.[0]?.priceAmount || 0) / 100
                        )}
                      </span>
                      <span className="text-muted-foreground">/year</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">
                        <strong>Unlimited AI tokens</strong>
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">
                        <strong>All AI models</strong> (GPT-4, Claude, Gemini,
                        Llama)
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">Advanced API integration</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">All features included</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm">Early access to features</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {user ? (
                    <Link
                      href={`/api/checkout?products=${premiumYearly.id}&customerEmail=${user.email}`}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        size="lg"
                      >
                        Subscribe Now
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="w-full">
                      <Button
                        className="w-full bg-transparent"
                        size="lg"
                        variant="outline"
                      >
                        Login to Subscribe
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Acyrx Payment</p>
        </div>
      </footer>
    </div>
  );
}
