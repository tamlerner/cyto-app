'use client';

import { Document, Page, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { styles } from '../styles';
import { formatCurrency } from '@/lib/utils/currency';
import type { Invoice, InvoiceItem } from '@/lib/types';

interface InvoicePDFProps {
  invoice: Invoice & {
    client: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
    company: {
      company_name: string;
      tax_id: string;
      headquarters_address: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
  };
  items: InvoiceItem[];
}

export function InvoicePDF({ invoice, items }: InvoicePDFProps) {
  const document = (
    <Document
      title={`Invoice ${invoice.invoice_number}`}
      author={invoice.company.company_name}
      creator="CYTO"
      producer="CYTO Invoicing System"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{invoice.company.company_name}</Text>
            <Text style={styles.companyDetails}>{invoice.company.tax_id}</Text>
            <Text style={styles.companyDetails}>{invoice.company.headquarters_address}</Text>
            <Text style={styles.companyDetails}>
              {invoice.company.city}, {invoice.company.region} {invoice.company.postal_code}
            </Text>
            <Text style={styles.companyDetails}>{invoice.company.country}</Text>
          </View>
          <View>
            <Text style={styles.documentTitle}>INVOICE</Text>
            <Text style={styles.companyDetails}>#{invoice.invoice_number}</Text>
            <Text style={styles.companyDetails}>
              Issue Date: {format(new Date(invoice.issue_date), 'PPP')}
            </Text>
            <Text style={styles.companyDetails}>
              Due Date: {format(new Date(invoice.due_date), 'PPP')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bill To:</Text>
          <Text style={styles.value}>{invoice.client.company_name}</Text>
          <Text style={styles.value}>{invoice.client.tax_id}</Text>
          <Text style={styles.value}>{invoice.client.headquarters_address}</Text>
          <Text style={styles.value}>
            {invoice.client.city}, {invoice.client.region} {invoice.client.postal_code}
          </Text>
          <Text style={styles.value}>{invoice.client.country}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.quantity}>Quantity</Text>
            <Text style={styles.price}>Unit Price</Text>
            <Text style={styles.amount}>Amount</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.price}>
                {formatCurrency(item.unit_price, invoice.currency)}
              </Text>
              <Text style={styles.amount}>
                {formatCurrency(item.quantity * item.unit_price, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.tax_total, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );

  return document;
}