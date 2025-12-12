"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/lib/actions/profile";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function User() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const profile = await getProfile();
      setUser(profile);
    }
    loadProfile();
  }, []);
  return (
    <div className="flex gap-2">
      {/* USER ROW */}
      <div className="flex items-center gap-3">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={user?.avatar_url || ""}
            alt="User"
          />
          <AvatarFallback>
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>

        {/* Animated email */}
        <motion.span
          initial={false}
          animate={{
            opacity: 1,
            display: "inline-block",
          }}
          transition={{ duration: 0.2 }}
        >
          {user?.email || "Unknown User"}
        </motion.span>
      </div>

      {/* USER PLAN */}
      <motion.div
        initial={false}
        animate={{
          opacity: 1,
          display: "inline-block",
        }}
        transition={{ duration: 0.2 }}
      >
        <Badge
          variant="outline"
          className="ml-auto"
        >
          {user?.plan || "Free"}
        </Badge>
      </motion.div>
    </div>
  );
}
