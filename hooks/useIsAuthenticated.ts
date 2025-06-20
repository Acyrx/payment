import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useIsAuthenticated() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN") {
          setAuthenticated(true);
        } else if (event === "SIGNED_OUT") {
          setAuthenticated(false);
        }
      },
    );

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthenticated(!!user);
    };

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authenticated;
}
