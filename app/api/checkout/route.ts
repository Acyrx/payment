import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox",
  successUrl: process.env.SUCCESS_URL!,
  // returnUrl: "https://myapp.com",
  theme: "dark",
});
