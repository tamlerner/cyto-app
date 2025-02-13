import { NextResponse } from 'next/server';

// Configuration
const API_KEY = '543b55e60c9f7e08e6a86f4d';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;
const CACHE_DURATION = 30; // Cache duration in seconds

// Types
interface ExchangeRateResponse {
  result: string;
  conversion_rates: Record<string, number>;
  time_last_update_unix: number;
}

interface CombinedRatesResponse {
  result: string;
  rates: Record<string, {
    rate: number;
    change?: number;
  }>;
  timestamp: number;
  last_updated: string;
}

// Cache management
let cachedData: CombinedRatesResponse | null = null;
let lastFetchTime: number = 0;

async function fetchBaseRates(currency: string): Promise<ExchangeRateResponse> {
  const response = await fetch(`${BASE_URL}/latest/${currency}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${currency} rates`);
  }
  return response.json();
}

async function fetchExchangeRates(): Promise<CombinedRatesResponse> {
  const now = Date.now();
  
  // Return cached data if it's still fresh
  if (cachedData && (now - lastFetchTime) / 1000 < CACHE_DURATION) {
    return cachedData;
  }

  try {
    // Fetch USD rates as base for calculations
    const usdData = await fetchBaseRates('USD');
    
    // Calculate rates for all pairs
    const rates: Record<string, { rate: number; change?: number }> = {
      // AOA/EUR
      'AOAEUR': {
        rate: 1 / (usdData.conversion_rates.AOA * usdData.conversion_rates.EUR),
      },
      // AOA/USD
      'AOAUSD': {
        rate: 1 / usdData.conversion_rates.AOA,
      },
      // EUR/USD
      'EURUSD': {
        rate: 1 / usdData.conversion_rates.EUR,
      },
      // EUR/AOA
      'EURAOA': {
        rate: usdData.conversion_rates.AOA / usdData.conversion_rates.EUR,
      },
      // USD/AOA
      'USDAOA': {
        rate: usdData.conversion_rates.AOA,
      },
    };

    // Calculate changes if we have cached data
    if (cachedData) {
      Object.keys(rates).forEach((pair) => {
        const currentRate = rates[pair].rate;
        const previousRate = cachedData?.rates[pair]?.rate;
        if (previousRate) {
          rates[pair].change = ((currentRate - previousRate) / previousRate) * 100;
        }
      });
    }

    const combinedData: CombinedRatesResponse = {
      result: 'success',
      rates,
      timestamp: now,
      last_updated: new Date().toISOString()
    };
    
    // Cache the new data
    cachedData = combinedData;
    lastFetchTime = now;
    
    return combinedData;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const data = await fetchExchangeRates();
    
    return NextResponse.json({
      ...data,
      cached: lastFetchTime !== Date.now(),
      lastUpdate: new Date(lastFetchTime).toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch exchange rates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}