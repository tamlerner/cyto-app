'use client';

import { useState, useEffect } from 'react';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';

interface ExchangeRate {
  rate: number;
  change: number;
  history: Array<{ timestamp: number; value: number }>;
}

type ExchangeRates = Record<string, ExchangeRate>;
type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    async function fetchRates() {
      try {
        // Fetch base rates from API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        if (!mounted) return;

        const newRates: ExchangeRates = {};
        
        // Generate historical data for each pair
        CURRENCY_PAIRS.forEach(({ from, to }) => {
          const baseRate = calculateRate(data.rates, from, to);
          const history = generateHistory(baseRate);
          const change = calculateChange(history);
          
          newRates[`${from}${to}`] = {
            rate: baseRate,
            change,
            history
          };
        });

        setRates(newRates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchRates();
    interval = setInterval(fetchRates, 60000); // Update every minute

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { rates, loading };
}

function calculateRate(rates: Record<string, number>, from: string, to: string): number {
  if (from === to) return 1;
  if (from === 'USD') return rates[to];
  if (to === 'USD') return 1 / rates[from];
  return rates[to] / rates[from];
}

function generateHistory(baseRate: number): Array<{ timestamp: number; value: number }> {
  const now = Date.now();
  const history: Array<{ timestamp: number; value: number }> = [];
  
  // Generate 24 hours of data points (one per hour)
  for (let i = 24; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const value = baseRate * (1 + variation);
    history.push({ timestamp, value });
  }
  
  return history;
}

function calculateChange(history: Array<{ timestamp: number; value: number }>): number {
  if (history.length < 2) return 0;
  const first = history[0].value;
  const last = history[history.length - 1].value;
  return ((last - first) / first) * 100;
}