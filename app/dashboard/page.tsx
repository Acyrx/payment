"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, CreditCard, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        // Automatically fetch subscriptions once we have the email
        fetchSubscriptionsForEmail(user.email);
      } else {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  const fetchSubscriptionsForEmail = async (userEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/subscriptions?email=${encodeURIComponent(userEmail)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch subscriptions");
      }

      setSubscriptions(data.subscriptions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerPortal = () => {
    if (!email) {
      setError("Please log in to access customer portal");
      return;
    }
    window.location.href = `/api/customer-portal?email=${encodeURIComponent(
      email
    )}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "canceled":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "revoked":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <header className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600" />
              <span className="font-semibold text-xl">Polar Subscriptions</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Browse Plans</Button>
              </Link>
            </nav>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-24">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Authentication Required
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
                Please log in to view and manage your subscriptions
              </p>
              <div className="flex gap-3">
                <Link href="/auth/login">
                  <Button>Log In</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/acyrx2.png"
              alt="AI Logo"
              width={60}
              height={60}
              className="object-contain rounded-xl"
            />
            <span className="font-semibold text-xl">Acyrx Payment</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Browse Plans</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Subscription Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your subscriptions and billing
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>Logged in as {email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => fetchSubscriptionsForEmail(email)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh Subscriptions"}
              </Button>
              {/* <Button
                variant="outline"
                onClick={handleCustomerPortal}
                disabled={isLoading}
              >
                Customer Portal
              </Button> */}
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* Subscriptions List */}
        {subscriptions.length > 0 ? (
          <div className="grid gap-6">
            <h2 className="text-2xl font-semibold">Your Subscriptions</h2>
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        {subscription.products?.name || "Subscription"}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {subscription.products?.description ||
                          "Active subscription"}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status.charAt(0).toUpperCase() +
                        subscription.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Price</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency:
                              subscription.products?.price_currency || "USD",
                          }).format(
                            (subscription.products?.price_amount || 0) / 100
                          )}{" "}
                          / month
                        </p>
                      </div>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex items-start gap-3">
                        <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">
                            Next Billing Date
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              subscription.current_period_end
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No Subscriptions Found
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
                You don't have any active subscriptions yet
              </p>
              <Link href="/">
                <Button>Browse Available Plans</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
