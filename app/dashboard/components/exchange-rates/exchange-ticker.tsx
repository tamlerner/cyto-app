'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExchangeTickerProps {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  change: number;
  previousRate?: number;
  selected?: boolean;
  shine?: boolean;
}

export function ExchangeTicker({ 
  fromCurrency, 
  toCurrency, 
  rate, 
  change,
  previousRate,
  selected,
  shine 
}: ExchangeTickerProps) {
  const isPositive = change >= 0;
  const hasChanged = previousRate !== undefined && rate !== previousRate;
  const changeDirection = previousRate !== undefined ? (rate > previousRate ? 'up' : 'down') : null;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      selected ? "ring-2 ring-primary" : "hover:shadow-lg",
      hasChanged && "animate-pulse",
      shine && "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:animate-shine"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              {fromCurrency}/{toCurrency}
            </div>
            <div className={cn(
              "text-2xl font-bold tabular-nums transition-colors duration-300",
              hasChanged && changeDirection === 'up' && "text-green-500",
              hasChanged && changeDirection === 'down' && "text-red-500"
            )}>
              {rate.toFixed(4)}
            </div>
          </div>
          
          <div className={cn(
            "flex items-center px-2 py-1 rounded",
            isPositive ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
          )}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium tabular-nums">
              {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        </div>

        {hasChanged && (
          <div className={cn(
            "mt-2 text-xs font-medium tabular-nums",
            changeDirection === 'up' ? "text-green-500" : "text-red-500"
          )}>
            {changeDirection === 'up' ? '▲' : '▼'} {Math.abs(rate - previousRate).toFixed(4)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}