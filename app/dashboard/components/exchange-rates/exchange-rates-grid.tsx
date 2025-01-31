'use client';

import { useEffect, useState } from 'react';
import { ExchangeTicker } from './exchange-ticker';
import { useExchangeRates } from '../../hooks/use-exchange-rates';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface RateData {
  rate: number;
  change: number;
  history: Array<{ timestamp: number; value: number }>;
}

interface RatesState {
  [key: string]: RateData;
}

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

const HISTORY_LENGTH = {
  daily: 24,    // 24 points for daily view (hourly)
  weekly: 168,  // 168 points for weekly view (hourly)
  monthly: 30,  // 30 points for monthly view (daily)
  yearly: 12    // 12 points for yearly view (monthly)
};

const TIME_INTERVALS = {
  daily: 3600000,    // 1 hour in ms
  weekly: 3600000,   // 1 hour in ms
  monthly: 86400000, // 1 day in ms
  yearly: 2592000000 // 1 month in ms
};

export function ExchangeRatesGrid() {
  const { t } = useTranslation();
  const { rates, loading } = useExchangeRates();
  const [currentRates, setCurrentRates] = useState<RatesState>({});
  const [previousRates, setPreviousRates] = useState<RatesState>({});
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [shine, setShine] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Initialize or update rates with history
  useEffect(() => {
    if (!loading && Object.keys(rates).length > 0) {
      setPreviousRates(currentRates);
      setCurrentRates(prev => {
        const newRates = { ...prev };
        Object.entries(rates).forEach(([key, data]) => {
          const currentHistory = newRates[key]?.history || [];
          const now = Date.now();
          
          // Generate historical data points if needed
          if (currentHistory.length < HISTORY_LENGTH[timeRange]) {
            const interval = TIME_INTERVALS[timeRange];
            const baseRate = data.rate;
            const volatility = 0.001; // 0.1% volatility
            
            for (let i = HISTORY_LENGTH[timeRange] - 1; i >= 0; i--) {
              const timestamp = now - (i * interval);
              const randomChange = (Math.random() - 0.5) * 2 * volatility;
              const value = baseRate * (1 + randomChange);
              
              if (!currentHistory.find(h => h.timestamp === timestamp)) {
                currentHistory.push({ timestamp, value });
              }
            }
          }
          
          newRates[key] = {
            ...data,
            history: [
              ...currentHistory,
              { timestamp: now, value: data.rate }
            ].slice(-HISTORY_LENGTH[timeRange])
          };
        });
        return newRates;
      });
    }
  }, [rates, loading, timeRange]);

  // Simulate live updates and shining effect
  useEffect(() => {
    if (!loading) {
      // Rate updates
      const updateInterval = setInterval(() => {
        setCurrentRates(prev => {
          const newRates = { ...prev };
          CURRENCY_PAIRS.forEach(({ from, to }) => {
            const key = `${from}${to}`;
            if (Math.random() > 0.7) {
              const currentRate = newRates[key]?.rate || 0;
              const change = (Math.random() - 0.5) * 0.001;
              const newRate = currentRate * (1 + change);
              
              newRates[key] = {
                rate: newRate,
                change: ((newRate - currentRate) / currentRate) * 100,
                history: [
                  ...(newRates[key]?.history || []),
                  { timestamp: Date.now(), value: newRate }
                ].slice(-HISTORY_LENGTH[timeRange])
              };
            }
          });
          return newRates;
        });
      }, 1000);

      // Shining effect
      const shineInterval = setInterval(() => {
        setShine(true);
        setTimeout(() => setShine(false), 500);
      }, 5000);

      return () => {
        clearInterval(updateInterval);
        clearInterval(shineInterval);
      };
    }
  }, [loading, timeRange]);

  const handlePairClick = (pair: string) => {
    setSelectedPair(pair);
    setExpanded(true);
    setTimeRange('weekly'); // Always start with weekly view when expanded
  };

  const handleClose = () => {
    setExpanded(false);
    setTimeout(() => {
      setSelectedPair(null);
      setTimeRange('weekly'); // Reset to weekly view when closed
    }, 300);
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

  const selectedPairData = selectedPair ? currentRates[selectedPair] : null;
  const [fromCurrency, toCurrency] = selectedPair?.split('') || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {CURRENCY_PAIRS.map(({ from, to }) => {
          const key = `${from}${to}`;
          const current = currentRates[key];
          const previous = previousRates[key];
          
          if (!current) return null;

          return (
            <div
              key={key}
              onClick={() => handlePairClick(key)}
              className={`cursor-pointer transition-all duration-300 ${
                shine ? 'animate-pulse' : ''
              }`}
            >
              <ExchangeTicker
                fromCurrency={from}
                toCurrency={to}
                rate={current.rate}
                change={current.change}
                previousRate={previous?.rate}
                selected={selectedPair === key}
                shine={shine}
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
            className="relative"
          >
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>
                    {fromCurrency}/{toCurrency} {t('Dashboard.ExchangeRate')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((range) => (
                      <Button
                        key={range}
                        variant={timeRange === range ? 'default' : 'outline'}
                        onClick={() => setTimeRange(range)}
                        size="sm"
                      >
                        {t(`Dashboard.TimeRange.${range}`)}
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
                    <LineChart data={selectedPairData.history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp"
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          switch (timeRange) {
                            case 'daily':
                              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            case 'weekly':
                              return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit' })}`;
                            case 'monthly':
                              return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
                            case 'yearly':
                              return date.toLocaleDateString([], { month: 'short' });
                          }
                        }}
                        interval={timeRange === 'weekly' ? 24 : 'preserveStartEnd'}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tickFormatter={(value) => value.toFixed(4)}
                      />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: number) => [value.toFixed(4), 'Rate']}
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius)'
                        }}
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