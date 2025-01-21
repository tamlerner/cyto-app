'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface ExchangeTickerProps {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  change: number;
}

export function ExchangeTicker({ fromCurrency, toCurrency, rate, change }: ExchangeTickerProps) {
  const isPositive = change >= 0;
  const changeClass = isPositive ? 'text-green-500' : 'text-red-500';
  const transitionClass = 'transition-all duration-300 ease-in-out transform hover:scale-105';

  return (
    <Card className={transitionClass}>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-sm text-muted-foreground">
            {fromCurrency}/{toCurrency}
          </div>
          <div className="text-xl font-bold">
            {rate.toFixed(4)}
          </div>
        </div>
        <div className={`flex items-center ${changeClass}`}>
          {isPositive ? (
            <ArrowUpIcon className="h-4 w-4 animate-bounce" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 animate-bounce" />
          )}
          <span className="ml-1">{Math.abs(change).toFixed(2)}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
