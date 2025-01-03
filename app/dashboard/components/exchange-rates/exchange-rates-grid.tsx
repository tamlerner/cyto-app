'use client';

import { ExchangeTicker } from './exchange-ticker';
import { useExchangeRates } from '../../hooks/use-exchange-rates';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';
import { useEffect, useState } from 'react';

export function ExchangeRatesGrid() {
  const { rates, loading } = useExchangeRates();
  const [refreshedRates, setRefreshedRates] = useState(rates);

  useEffect(() => {
    setRefreshedRates(rates);
  }, [rates]);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setRefreshedRates(rates);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, rates]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {CURRENCY_PAIRS.map((_, index) => (
          <Skeleton key={index} className="h-[72px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {CURRENCY_PAIRS.map(({ from, to }) => {
        const rate = refreshedRates[`${from}${to}`];
        return (
          <ExchangeTicker
            key={`${from}${to}`}
            fromCurrency={from}
            toCurrency={to}
            rate={rate?.rate || 0}
            change={rate?.change || 0}
          />
        );
      })}
    </div>
  );
}