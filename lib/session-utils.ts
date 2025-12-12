import crypto from "crypto";

// Parse user agent to extract browser, OS, and device info
export function parseUserAgent(userAgent: string) {
  let browser = "Unknown";
  let browserVersion = "Unknown";
  let os = "Unknown";
  let osVersion = "Unknown";
  let deviceType = "Unknown";

  // Browser detection
  if (userAgent.includes("Chrome")) {
    browser = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+)/i);
    browserVersion = match ? match[1] : "Unknown";
    deviceType = userAgent.includes("Mobile") ? "Mobile" : "Desktop";
  } else if (userAgent.includes("Safari")) {
    browser = "Safari";
    const match = userAgent.match(/Version\/(\d+)/i);
    browserVersion = match ? match[1] : "Unknown";
    deviceType = userAgent.includes("Mobile") ? "Mobile" : "Desktop";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+)/i);
    browserVersion = match ? match[1] : "Unknown";
    deviceType = userAgent.includes("Mobile") ? "Mobile" : "Desktop";
  } else if (userAgent.includes("Edge")) {
    browser = "Edge";
    const match = userAgent.match(/Edg\/(\d+)/i);
    browserVersion = match ? match[1] : "Unknown";
    deviceType = "Desktop";
  }

  // OS detection
  if (userAgent.includes("Windows")) {
    os = "Windows";
    const match = userAgent.match(/Windows NT ([\d.]+)/i);
    osVersion = match ? match[1] : "Unknown";
  } else if (userAgent.includes("Mac")) {
    os = "macOS";
    const match = userAgent.match(/Mac OS X ([\d_]+)/i);
    osVersion = match ? match[1].replace(/_/g, ".") : "Unknown";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
    osVersion = "Unknown";
  } else if (userAgent.includes("Android")) {
    os = "Android";
    const match = userAgent.match(/Android ([\d.]+)/i);
    osVersion = match ? match[1] : "Unknown";
    deviceType = "Mobile";
  } else if (userAgent.includes("iOS")) {
    os = "iOS";
    const match = userAgent.match(/OS ([\d_]+)/i);
    osVersion = match ? match[1].replace(/_/g, ".") : "Unknown";
    deviceType = "Mobile";
  }

  return { browser, browserVersion, os, osVersion, deviceType };
}

// Generate a secure session token
export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Get client country and city from headers
export function getLocationFromHeaders(headers: Headers) {
  const country =
    headers.get("cf-ipcountry") ||
    headers.get("x-vercel-ip-country") ||
    "Unknown";
  const city = headers.get("x-vercel-ip-city") || "Unknown";
  const latitude = headers.get("x-vercel-ip-latitude");
  const longitude = headers.get("x-vercel-ip-longitude");

  return {
    country,
    city,
    latitude: latitude ? Number.parseFloat(latitude) : null,
    longitude: longitude ? Number.parseFloat(longitude) : null,
  };
}

// Get client IP from headers
export function getClientIP(headers: Headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    headers.get("x-real-ip") ||
    "Unknown"
  );
}
