'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExchangeRates } from '../../hooks/use-exchange-rates';
import { cn } from '@/lib/utils';

const CURRENCIES = ['AOA', 'USD', 'EUR'] as const;

export function CurrencyConverter() {
  const { t } = useTranslation();
  const { rates } = useExchangeRates();
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<string>('AOA');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<number | null>(null);
  const [isVertical, setIsVertical] = useState(false);

  // Get the current exchange rate for the selected currency pair
  const getExchangeRate = (from: string, to: string) => {
    const key = `${from}${to}`;
    return rates[key]?.rate || 0;
  };

  // Convert the amount
  const convertAmount = () => {
    const rate = getExchangeRate(fromCurrency, toCurrency);
    if (rate && amount) {
      setResult(parseFloat(amount) * rate);
    }
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result !== null) {
      setAmount(result.toFixed(2));
      setResult(null);
    }
  };

  // Update result when inputs change
  useEffect(() => {
    if (amount) {
      convertAmount();
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('ExchangeRates.Converter')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-4",
          isVertical ? "grid-cols-1" : "grid-cols-[1fr,auto,1fr]"
        )}>
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('ExchangeRates.From')}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={swapCurrencies}
              className="rounded-full"
            >
              {isVertical ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t('ExchangeRates.To')}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={result?.toFixed(2) || ''}
                readOnly
                placeholder="0.00"
                className="flex-1"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Exchange Rate Display */}
        {amount && result !== null && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              {t('ExchangeRates.CurrentRate')}: 1 {fromCurrency} ={' '}
              {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}