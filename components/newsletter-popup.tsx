'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NewsletterPopupProps {
  onClose: () => void;
}

export function NewsletterPopup({ onClose }: NewsletterPopupProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className={`transform transition-transform duration-500 ${
        visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-bold">Subscribe to Our Newsletter</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Stay updated with the latest news from AppCyto.
        </p>

        <form
          action="https://www.appcyto.com/en/news"
          method="post"
          target="_blank"
          className="mt-4 space-y-4"
        >
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Subscribe
          </Button>
        </form>

        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 500); // Delay close to allow animation
          }}
          className="mt-4 w-full text-sm text-primary hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
