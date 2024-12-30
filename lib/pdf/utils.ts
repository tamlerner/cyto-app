import { Font } from '@react-pdf/renderer';

// Define font URLs - using Google Fonts CDN for reliability
const FONTS = {
  roboto: {
    normal: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf',
    medium: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf',
    bold: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc-.ttf',
  }
};

let fontsRegistered = false;

export async function registerFonts() {
  if (fontsRegistered) return true;

  try {
    // Register Roboto with multiple weights
    Font.register({
      family: 'Roboto',
      fonts: [
        { src: FONTS.roboto.normal, fontWeight: 400 },
        { src: FONTS.roboto.medium, fontWeight: 500 },
        { src: FONTS.roboto.bold, fontWeight: 700 },
      ],
    });

    fontsRegistered = true;
    return true;
  } catch (error) {
    console.error('Failed to register fonts:', error);
    return false;
  }
}