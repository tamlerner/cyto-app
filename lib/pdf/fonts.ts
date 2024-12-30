import { Font } from '@react-pdf/renderer';

// Register system fonts as fallback first
Font.register({
  family: 'Fallback',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf' },
  ],
});

export async function loadFonts() {
  try {
    // Register Inter font with multiple weights
    await Font.register({
      family: 'Inter',
      fonts: [
        {
          src: '/fonts/Inter-Regular.ttf',
          fontWeight: 400,
        },
        {
          src: '/fonts/Inter-Medium.ttf', 
          fontWeight: 500,
        },
        {
          src: '/fonts/Inter-Bold.ttf',
          fontWeight: 700,
        },
      ],
    });
    return true;
  } catch (error) {
    console.error('Failed to load Inter font:', error);
    // Fallback to system font
    return false;
  }
}