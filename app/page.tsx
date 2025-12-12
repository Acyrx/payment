"use client";

import { PricingCard } from "@/components/pricing-card";
import useIsAuthenticated from "@/hooks/useIsAuthenticated";
import {
  GraduationCap,
  Users,
  Briefcase,
  FlaskConical,
  BookOpen,
  Palette,
  School,
} from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Pupil",
    price: 9,
    period: "month",
    icon: BookOpen,
    description: "Perfect for individual young learners",
    features: [
      "Access to 50+ AI-powered learning apps",
      "Interactive digital books library",
      "Basic homework helper",
      "Progress tracking dashboard",
      "Email support",
    ],
  },
  {
    name: "Student",
    price: 15,
    period: "month",
    icon: GraduationCap,
    description: "Ideal for high school and college students",
    features: [
      "Everything in Pupil plan",
      "Advanced research tools",
      "Essay writing assistant",
      "Citation generator",
      "Study planner with AI recommendations",
      "Priority support",
    ],
  },
  {
    name: "Family",
    price: 29,
    period: "month",
    featured: true,
    icon: Users,
    description: "Best value for families learning together",
    features: [
      "Up to 5 family member accounts",
      "All Student plan features",
      "Parental monitoring dashboard",
      "Custom learning paths for each member",
      "Family progress reports",
      "24/7 priority support",
    ],
  },
  {
    name: "Classroom",
    price: 79,
    period: "month",
    icon: School,
    description: "Designed for teachers and classrooms",
    features: [
      "Up to 30 student accounts",
      "Teacher admin dashboard",
      "Assignment creation & grading tools",
      "Real-time class analytics",
      "Collaborative learning spaces",
      "Professional development resources",
    ],
  },
  {
    name: "Club & Arts",
    price: 59,
    period: "month",
    icon: Palette,
    description: "For creative learning groups",
    features: [
      "Up to 20 member accounts",
      "Creative AI tools (art, music, writing)",
      "Project collaboration features",
      "Portfolio builder",
      "Exhibition and showcase tools",
      "Dedicated account manager",
    ],
  },
  {
    name: "Business",
    price: 149,
    period: "month",
    icon: Briefcase,
    description: "Professional development for teams",
    features: [
      "Unlimited team members",
      "Corporate training modules",
      "Skills assessment tools",
      "Custom content integration",
      "Advanced analytics & reporting",
      "API access",
      "Dedicated support team",
    ],
  },
  {
    name: "Science",
    price: 99,
    period: "month",
    icon: FlaskConical,
    description: "Advanced tools for STEM education",
    features: [
      "Up to 40 user accounts",
      "Virtual lab simulations",
      "Data analysis tools",
      "Research paper assistant",
      "Experiment planning tools",
      "Scientific citation manager",
      "Conference-ready presentations",
    ],
  },
  {
    name: "Institution",
    price: 299,
    period: "month",
    icon: School,
    description: "For nurseries, elementary schools & colleges",
    features: [
      "Unlimited student accounts",
      "Multi-grade level support",
      "Complete LMS integration",
      "Custom branding",
      "Advanced security & compliance",
      "Dedicated training & onboarding",
      "24/7 premium support",
      "Quarterly business reviews",
    ],
  },
];

export default function PricingPage() {
  const isAuthenticated = useIsAuthenticated();

  const router = useRouter();

  if (isAuthenticated) {
    router.push("/account");
  }
  return (
    <div
      className="from-background via-background to-muted min-h-screen bg-gradient-to-br px-4
        py-24"
    >
      <div className="mx-auto max-w-7xl space-y-16">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div
            className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2
              rounded-full border px-4 py-2 text-sm font-semibold"
          >
            <GraduationCap className="h-4 w-4" />
            AI-Powered Learning Platform
          </div>
          <h1 className="text-foreground text-5xl leading-tight font-bold text-balance md:text-6xl">
            Empower Every Learner with AI
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed text-balance md:text-xl">
            From individual students to entire institutions, choose the perfect
            plan for your learning journey. Access hundreds of AI-powered tools,
            interactive books, and mini apps designed to make learning engaging
            and effective.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
            />
          ))}
        </div>

        {/* What's Included Section */}
        <div className="border-border mt-24 border-t pt-16">
          <div className="space-y-12 text-center">
            <div className="space-y-4">
              <h2 className="text-foreground text-3xl font-bold md:text-4xl">
                What's Included in Every Plan
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                All plans come with these essential features to enhance your
                learning experience
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 text-left md:grid-cols-3 lg:gap-12">
              <div className="space-y-4">
                <div
                  className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center
                    rounded-xl border shadow-sm"
                >
                  <BookOpen className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground text-xl font-bold">
                  AI-Powered Books
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Interactive digital library with AI reading comprehension,
                  vocabulary building, and personalized recommendations tailored
                  to each learner.
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center
                    rounded-xl border shadow-sm"
                >
                  <GraduationCap className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground text-xl font-bold">
                  Learning Mini Apps
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hundreds of specialized tools for math, science, languages,
                  arts, and more—all powered by cutting-edge AI technology.
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className="bg-primary/10 border-primary/20 flex h-14 w-14 items-center justify-center
                    rounded-xl border shadow-sm"
                >
                  <FlaskConical className="text-primary h-7 w-7" />
                </div>
                <h3 className="text-foreground text-xl font-bold">
                  Smart Analytics
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track progress with intelligent insights that adapt to each
                  learner's pace, style, and individual learning preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
