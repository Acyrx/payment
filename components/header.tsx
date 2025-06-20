"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/features/themes/theme-toggle";
import useIsAuthenticated from "@/hooks/useIsAuthenticated";
import { signOut } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await signOut(supabase);
    router.push("/");
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          className="text-lg font-semibold"
          href="/"
        >
          Home
        </Link>
        <div className="flex flex-row gap-2">
          {isAuthenticated ? (
            <Button
              onClick={handleSignOut}
              variant="outline"
            >
              Sign Out
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
