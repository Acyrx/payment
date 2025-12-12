"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/features/themes/theme-toggle";
import useIsAuthenticated from "@/hooks/useIsAuthenticated";
import { signOut } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import User from "./user";
import { motion } from "framer-motion";

export function Header() {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await signOut(supabase);
    router.push("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-background/60 sticky top-0 z-50 border-b backdrop-blur-md"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          className="text-xl font-semibold tracking-tight transition hover:opacity-80"
          href="https://app.acyrx.com"
        >
          Acyrx Payment
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="rounded-xl"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-xl"
            >
              <Link href="/auth">Sign In</Link>
            </Button>
          )}

          <div className="ml-1">
            <User />
          </div>

          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
