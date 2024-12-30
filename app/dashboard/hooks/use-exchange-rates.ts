'use client';

import { useState, useEffect } from 'react';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';
import { calculateExchangeRate } from '@/lib/utils/exchange-rates';

interface ExchangeRate {
  rate: number;
  change: number;
}

type ExchangeRates = Record<string, ExchangeRate>;

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        const newRates: ExchangeRates = {};
        
        CURRENCY_PAIRS.forEach(({ from, to }) => {
          const rate = calculateExchangeRate(data.rates, from, to);
          const key = `${from}${to}`;
          newRates[key] = {
            rate,
            change: (Math.random() * 2 - 1), // Simulate changes (replace with real data)
          };
        });

        setRates(newRates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { rates, loading };
}