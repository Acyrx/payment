import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Create rate limiters for different auth endpoints
const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 signups per hour per identifier
  analytics: true,
});

const signinLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"), // 10 login attempts per 15 minutes
  analytics: true,
});

const passwordResetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 password reset requests per hour
  analytics: true,
});

const verificationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 verification attempts per 10 minutes
  analytics: true,
});

// Rate limit constants for general rate limiting
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60; // 15 minutes

// Rate limit result type
type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetIn: number;
};

export async function checkSignupLimit(
  identifier: string,
): Promise<{ allowed: boolean; resetAfter?: number }> {
  try {
    const { success, reset } = await signupLimiter.limit(
      `signup:${identifier}`,
    );
    return {
      allowed: success,
      resetAfter: reset ? Math.ceil((reset - Date.now()) / 1000) : undefined,
    };
  } catch (error) {
    console.error("[v0] Rate limiter error (signup):", error);
    // Fail open - allow request if rate limiter fails
    return { allowed: true };
  }
}

export async function checkSigninLimit(
  identifier: string,
): Promise<{ allowed: boolean; resetAfter?: number }> {
  try {
    const { success, reset } = await signinLimiter.limit(
      `signin:${identifier}`,
    );
    return {
      allowed: success,
      resetAfter: reset ? Math.ceil((reset - Date.now()) / 1000) : undefined,
    };
  } catch (error) {
    console.error("[v0] Rate limiter error (signin):", error);
    return { allowed: true };
  }
}

export async function checkPasswordResetLimit(
  identifier: string,
): Promise<{ allowed: boolean; resetAfter?: number }> {
  try {
    const { success, reset } = await passwordResetLimiter.limit(
      `reset:${identifier}`,
    );
    return {
      allowed: success,
      resetAfter: reset ? Math.ceil((reset - Date.now()) / 1000) : undefined,
    };
  } catch (error) {
    console.error("[v0] Rate limiter error (password reset):", error);
    return { allowed: true };
  }
}

export async function checkVerificationLimit(
  identifier: string,
): Promise<{ allowed: boolean; resetAfter?: number }> {
  try {
    const { success, reset } = await verificationLimiter.limit(
      `verify:${identifier}`,
    );
    return {
      allowed: success,
      resetAfter: reset ? Math.ceil((reset - Date.now()) / 1000) : undefined,
    };
  } catch (error) {
    console.error("[v0] Rate limiter error (verification):", error);
    return { allowed: true };
  }
}

export async function checkRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`;

  // Get current count
  const currentCount = await redis.get<number>(key);

  if (currentCount === null) {
    // First attempt - set count to 1 with expiry
    await redis.setex(key, RATE_LIMIT_WINDOW_SECONDS, 1);
    return {
      success: true,
      remaining: RATE_LIMIT_MAX_ATTEMPTS - 1,
      resetIn: RATE_LIMIT_WINDOW_SECONDS,
    };
  }

  if (currentCount >= RATE_LIMIT_MAX_ATTEMPTS) {
    // Get TTL to know when rate limit resets
    const ttl = await redis.ttl(key);
    return {
      success: false,
      remaining: 0,
      resetIn: ttl > 0 ? ttl : RATE_LIMIT_WINDOW_SECONDS,
    };
  }

  // Increment count
  await redis.incr(key);
  const ttl = await redis.ttl(key);

  return {
    success: true,
    remaining: RATE_LIMIT_MAX_ATTEMPTS - currentCount - 1,
    resetIn: ttl > 0 ? ttl : RATE_LIMIT_WINDOW_SECONDS,
  };
}
