"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Eye, EyeOff, Sparkles } from "lucide-react";
import { ErrorModal } from "@/components/error-modal";
import {
  signin,
  signinWithGithub,
  signinWithGoogle,
} from "@/app/auth/actions/auth";
import Image from "next/image";
import Link from "next/link";

const isEmail = (value: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    details?: string;
  }>({
    isOpen: false,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmail(email)) {
      setError({
        isOpen: true,
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        details: "Error Code: AUTH_002",
      });
      return;
    }

    setIsLoading(true);
    setError({ isOpen: false, message: "" });

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await signin(formData);

      if (!result.success) {
        setError({
          isOpen: true,
          title: "Login Failed",
          message: result.error?.message || "An unexpected error occurred",
          details: "Error Code: AUTH_001",
        });
        return;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError({
        isOpen: true,
        title: "Login Failed",
        message: errorMessage,
        details: "Error Code: AUTH_ERR",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      if (provider === "github") {
        await signinWithGithub();
      } else if (provider === "google") {
        await signinWithGoogle();
      }
    } catch (err) {
      setError({
        isOpen: true,
        title: "Social Login Failed",
        message: `We couldn't sign you in with ${provider}. This might be due to a temporary issue.`,
        details: `Error Code: SOCIAL_001 - ${provider.toUpperCase()}_AUTH_FAILED`,
      });
    }
  };

  return (
    <>
      <Card className="border-border/50 bg-card/80 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <div
              className="bg-primary/20 border-primary/30 flex h-14 w-14 items-center justify-center
                rounded-xl border"
            >
              <Image
                src="/images/acyrx2.png"
                alt="AI Logo"
                width={60}
                height={60}
                className="rounded-xl object-contain"
              />
            </div>
            <CardTitle
              className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl
                font-bold text-transparent"
            >
              Acyrx
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("github")}
              className="border-border/50 hover:bg-accent/50 hover:border-primary/30 h-11 transition-all
                duration-200"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              className="border-border/50 hover:bg-accent/50 hover:border-primary/30 h-11 transition-all
                duration-200"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-border/50 w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-11
                    pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3
                    -translate-y-1/2 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  className="border-border/50 bg-input/50 text-primary focus:ring-primary/20 h-4 w-4 rounded"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link href={"https://app.acyrx.com/auth"}>
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </Link>
            </div>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-full font-medium
                shadow-lg transition-all duration-200 hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div
                    className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin
                      rounded-full border-2"
                  />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="text-muted-foreground text-center text-sm">
            {"Don't have an account? "}
            <Link href="https://app.acyrx.com/auth?auth=signup">
              <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                Sign up
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <ErrorModal
        isOpen={error.isOpen}
        onClose={() => setError({ isOpen: false, message: "" })}
        title={error.title}
        message={error.message}
        details={error.details}
      />
    </>
  );
}
