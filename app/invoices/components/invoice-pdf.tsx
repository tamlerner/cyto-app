'use client';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Invoice, InvoiceItem } from '@/lib/types/invoice';
import { formatCurrency } from '@/lib/utils/invoice-utils';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  description: { width: '40%' },
  quantity: { width: '15%' },
  price: { width: '15%' },
  tax: { width: '15%' },
  total: { width: '15%' },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  totals: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 10,
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  items: InvoiceItem[];
  client: {
    company_name: string;
    tax_id: string;
    headquarters_address: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
  };
}

export function InvoicePDF({ invoice, items, client }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text>Invoice Number: {invoice.invoice_number}</Text>
          <Text>Date: {new Date(invoice.issue_date).toLocaleDateString()}</Text>
          <Text>Due Date: {new Date(invoice.due_date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.header}>
          <Text style={{ marginBottom: 10 }}>Bill To:</Text>
          <Text>{client.company_name}</Text>
          <Text>{client.tax_id}</Text>
          <Text>{client.headquarters_address}</Text>
          <Text>
            {client.city}, {client.region} {client.postal_code}
          </Text>
          <Text>{client.country}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.quantity}>Quantity</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.tax}>Tax %</Text>
            <Text style={styles.total}>Total</Text>
          </View>

          {items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.price}>{formatCurrency(item.unit_price)}</Text>
              <Text style={styles.tax}>{item.tax_rate}%</Text>
              <Text style={styles.total}>
                {formatCurrency(item.quantity * item.unit_price)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.tax_total)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}