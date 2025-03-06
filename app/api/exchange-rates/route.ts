import { NextResponse } from "next/server";

// Configuration
const API_KEY = process.env.EXCHANGERATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;
const CACHE_DURATION = 90000; // Cache duration in seconds (5 minutes)
const RATE_LIMIT_WINDOW = 36000; // 1 hour in seconds
const MAX_REQUESTS_PER_WINDOW = 60; // API limit per hour

// Rate limiting
let requestCount = 0;
let windowStart = Date.now();

// Cache management
let cachedData: any = null;
let lastFetchTime: number = 0;

async function fetchBaseRates(currency: string): Promise<any> {
  // Check rate limit
  const now = Date.now();
  if (now - windowStart > RATE_LIMIT_WINDOW * 100000) {
    // Reset window
    requestCount = 0;
    windowStart = now;
  }

  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    const response = await fetch(`${BASE_URL}/latest/${currency}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${currency} rates`);
    }

    requestCount++;
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${currency} rates:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    const now = Date.now();

    // Return cached data if it's still fresh
    if (cachedData && (now - lastFetchTime) / 100000 < CACHE_DURATION) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
        lastUpdate: new Date(lastFetchTime).toISOString(),
      });
    }

    // Fetch USD rates as base
    const usdData = await fetchBaseRates("USD");

    if (!usdData.conversion_rates) {
      throw new Error("Invalid rate data received");
    }

    // Calculate all needed rates
    const rates = {
      AOAEUR: {
        rate: 1 / (usdData.conversion_rates.AOA * usdData.conversion_rates.EUR),
      },
      AOAUSD: {
        rate: 1 / usdData.conversion_rates.AOA,
      },
      EURUSD: {
        rate: 1 / usdData.conversion_rates.EUR,
      },
      EURAOA: {
        rate: usdData.conversion_rates.AOA / usdData.conversion_rates.EUR,
      },
      USDAOA: {
        rate: usdData.conversion_rates.AOA,
      },
    };

    const responseData = {
      result: "success",
      rates,
      timestamp: now,
      last_updated: new Date().toISOString(),
      cached: false,
    };

    // Update cache
    cachedData = responseData;
    lastFetchTime = now;

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_DURATION}`,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch exchange rates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
