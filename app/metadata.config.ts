import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: 'CYTO | Business Suite',
  description: 'Financial management and business productivity platform for African businesses',
  applicationName: 'CYTO Business Suite',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://appcyto.com'),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}