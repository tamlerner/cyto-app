'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExchangeTicker } from './exchange-ticker';
import { CurrencyConverter } from './currency-converter';
import { useExchangeRates } from '../../hooks/use-exchange-rates';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function ExchangeRatesGrid() {
  const { t } = useTranslation();
  const { rates, loading } = useExchangeRates();
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [expanded, setExpanded] = useState(false);

  const handlePairClick = (pair: string) => {
    setSelectedPair(pair);
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
    setTimeout(() => setSelectedPair(null), 300);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {CURRENCY_PAIRS.map((_, index) => (
            <Skeleton key={index} className="h-[100px]" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const selectedPairData = selectedPair ? rates[selectedPair] : null;
  const [fromCurrency, toCurrency] = selectedPair?.split('') || [];

  return (
    <div className="space-y-6">
      <CurrencyConverter rates={rates} />

      <div className="grid gap-4 md:grid-cols-3">
        {CURRENCY_PAIRS.map(({ from, to }) => {
          const key = `${from}${to}`;
          const data = rates[key];
          
          if (!data) return null;

          return (
            <div
              key={key}
              onClick={() => handlePairClick(key)}
              className="cursor-pointer transition-all duration-300"
            >
              <ExchangeTicker
                fromCurrency={from}
                toCurrency={to}
                rate={data.rate}
                change={data.change}
                selected={selectedPair === key}
              />
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {expanded && selectedPairData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>
                    {fromCurrency}/{toCurrency} {t('ExchangeRate')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? 'default' : 'outline'}
                        onClick={() => setTimeRange(range)}
                        size="sm"
                      >
                        {t(`TimeRange.${range}`)}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedPairData.history[timeRange]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp"
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          switch (timeRange) {
                            case 'daily':
                              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            case 'weekly':
                              return date.toLocaleDateString([], { weekday: 'short' });
                            case 'monthly':
                              return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
                            case 'yearly':
                              return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
                          }
                        }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => value.toFixed(4)}
                      />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: number) => [value.toFixed(4), 'Rate']}
                      />
                      <Line 
                        type="monotone"
                        dataKey="value"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}