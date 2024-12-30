'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { COUNTRY_CODES } from '@/lib/constants/countries';

interface PhoneInputProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
  error?: string;
}

export function PhoneInput({
  phoneNumber,
  onPhoneNumberChange,
  countryCode,
  onCountryCodeChange,
  error
}: PhoneInputProps) {
  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryCodeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name} ({country.code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
}