'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  // Local state to track the selected date (for display on the Button).
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

  const handleSelect = React.useCallback(
    (newDate: Date | undefined) => {
      if (!newDate) return;
      setSelectedDate(newDate);
      onSelect(newDate);

      // If you DO want the popover to automatically close after picking a date,
      //   you can do something like:
      // setPopoverOpen(false);
    },
    [onSelect]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !selectedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      {/* pointer-events-auto + z-50 can help ensure clicking inside is allowed and it's on top */}
      <PopoverContent className="w-auto p-0 pointer-events-auto z-50" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}