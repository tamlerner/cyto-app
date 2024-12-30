'use client';

import { ExchangeTicker } from './exchange-ticker';
import { useExchangeRates } from '../../hooks/use-exchange-rates';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';

export function ExchangeRatesGrid() {
  const { rates, loading } = useExchangeRates();

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
        const rate = rates[`${from}${to}`];
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