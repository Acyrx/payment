"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (window.location.href = "/welcome")}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Welcome to Acyrx AI
        </Button>
      </div>

      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
