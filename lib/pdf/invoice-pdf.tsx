'use client';

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import type { Invoice, InvoiceItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/currency';

// Simple styles using only built-in Helvetica font
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  companyInfo: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold'
  },
  table: {
    marginTop: 20
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  description: { width: '40%' },
  quantity: { width: '15%', textAlign: 'right' },
  price: { width: '15%', textAlign: 'right' },
  amount: { width: '15%', textAlign: 'right' },
  totals: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5
  },
  totalLabel: {
    width: 100,
    fontFamily: 'Helvetica-Bold'
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold'
  }
});

interface InvoiceDocumentProps {
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

export function InvoiceDocument({ invoice, items }: InvoiceDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text>{invoice.company.company_name}</Text>
            <Text>{invoice.company.tax_id}</Text>
            <Text>{invoice.company.headquarters_address}</Text>
            <Text>
              {invoice.company.city}, {invoice.company.region} {invoice.company.postal_code}
            </Text>
            <Text>{invoice.company.country}</Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text>#{invoice.invoice_number}</Text>
            <Text>Date: {format(new Date(invoice.issue_date), 'PP')}</Text>
            <Text>Due: {format(new Date(invoice.due_date), 'PP')}</Text>
          </View>
        </View>

        <View style={styles.companyInfo}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Bill To:</Text>
          <Text>{invoice.client.company_name}</Text>
          <Text>{invoice.client.tax_id}</Text>
          <Text>{invoice.client.headquarters_address}</Text>
          <Text>
            {invoice.client.city}, {invoice.client.region} {invoice.client.postal_code}
          </Text>
          <Text>{invoice.client.country}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.quantity}>Quantity</Text>
            <Text style={styles.price}>Price</Text>
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
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.tax_total, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}