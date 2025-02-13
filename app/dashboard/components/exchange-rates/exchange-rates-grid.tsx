import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURRENCY_PAIRS } from '@/lib/constants/currencies';
import { motion } from 'framer-motion';
import { RefreshCw, Calculator } from 'lucide-react';

interface ExchangeRate {
  rate: number;
  change?: number;
}

interface RatesData {
  [key: string]: ExchangeRate;
}

const ExchangeRateTicker: React.FC<{
  fromCurrency: string;
  toCurrency: string;
  rate?: ExchangeRate;
  previousRate?: number;
}> = ({ fromCurrency, toCurrency, rate, previousRate }) => {
  const hasChanged = previousRate && rate?.rate !== previousRate;
  const change = previousRate && rate?.rate ? 
    ((rate.rate - previousRate) / previousRate) * 100 : 
    undefined;
  const isPositive = change ? change >= 0 : false;
  
  return (
    <Card className="border bg-card hover:bg-accent/50 transition-all duration-300">
      <CardContent className="p-4">
        <motion.div 
          className="flex justify-between items-center"
          animate={{ 
            backgroundColor: hasChanged 
              ? (isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)') 
              : 'transparent' 
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="font-medium">{fromCurrency}/{toCurrency}</div>
          <div className="flex flex-col items-end">
            <motion.div 
              className="text-xl font-bold"
              initial={false}
              animate={{ scale: hasChanged ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {rate?.rate.toFixed(4) || 'Loading...'}
            </motion.div>
            <div 
              className={`text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
            >
              {change 
                ? `${isPositive ? '+' : ''}${Math.abs(change).toFixed(4)}%` 
                : '-'
              }
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

const CurrencyCalculator: React.FC<{ rates: RatesData }> = ({ rates }) => {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);

  const uniqueCurrencies = Array.from(
    new Set(CURRENCY_PAIRS.flatMap(pair => [pair.from, pair.to]))
  );

  const convert = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setResult(null);
      return;
    }

    const pairKey = `${fromCurrency}${toCurrency}`;
    const inversePairKey = `${toCurrency}${fromCurrency}`;
    
    let rate = rates[pairKey]?.rate;
    if (!rate && rates[inversePairKey]?.rate) {
      rate = 1 / rates[inversePairKey].rate;
    }

    if (rate) {
      setResult(numAmount * rate);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  useEffect(() => {
    convert();
  }, [amount, fromCurrency, toCurrency, convert]);

  return (
    <Card className="border bg-card">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 font-bold">
          <Calculator className="h-5 w-5" />
          Currency Calculator
        </div>
        <div className="space-y-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="bg-background"
          />
          <div className="grid grid-cols-2 gap-2">
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {uniqueCurrencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {result !== null && (
          <div className="pt-4 text-center">
            <div className="text-sm text-muted-foreground">
              {amount} {fromCurrency} =
            </div>
            <div className="text-2xl font-bold">
              {result.toFixed(4)} {toCurrency}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LiveExchangeRates: React.FC = () => {
  const [rates, setRates] = useState<RatesData>({});
  const [previousRates, setPreviousRates] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRates = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/exchange-rates', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch rates');
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Store previous rates before updating
      setPreviousRates(
        Object.keys(data.rates).reduce((acc, pair) => ({
          ...acc,
          [pair]: rates[pair]?.rate
        }), {})
      );

      setRates(data.rates);
      setLastUpdate(new Date(data.last_updated));
      setUpdateCount(prev => prev + 1);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates');
      console.error('Error fetching rates:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [rates]);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 5000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  const handleRefreshClick = () => {
    fetchRates();
  };

  if (error) {
    return (
      <Card className="border bg-card">
        <CardContent className="p-4">
          <div className="text-red-600 dark:text-red-400">Error loading exchange rates: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Exchange Rates</h2>
        <Button 
          variant="secondary"
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CURRENCY_PAIRS.map(({ from, to }) => {
              const pairKey = `${from}${to}`;
              return (
                <ExchangeRateTicker
                  key={`${pairKey}-${updateCount}`}
                  fromCurrency={from}
                  toCurrency={to}
                  rate={rates[pairKey]}
                  previousRate={previousRates[pairKey]}
                />
              );
            })}
          </div>
          
          {lastUpdate && (
            <div className="text-sm text-muted-foreground text-right">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <CurrencyCalculator rates={rates} />
        </div>
      </div>
    </div>
  );
};

export default LiveExchangeRates;