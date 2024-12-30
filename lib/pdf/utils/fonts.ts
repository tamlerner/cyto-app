'use client';

import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

export async function registerFonts() {
  if (fontsRegistered) return;

  try {
    await Font.register({
      family: 'Helvetica',
      fonts: [
        { src: '/fonts/Helvetica.ttf' },
        { src: '/fonts/Helvetica-Bold.ttf', fontWeight: 'bold' }
      ]
    });

    fontsRegistered = true;
  } catch (error) {
    console.error('Failed to register fonts:', error);
    throw new Error('Font registration failed');
  }
}