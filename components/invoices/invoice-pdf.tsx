import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';
import type { Invoice } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  companyInfo: {
    marginBottom: 20,
  },
  clientInfo: {
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  tableCell: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5
  },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  exchangeRates: {
    marginTop: 10,
    fontSize: 10,
    color: '#666',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
  }
});

export default function InvoicePDF({ invoice }: { invoice: Invoice }) {
    if (!invoice || !invoice.client || !invoice.company) {
        return null;
      }
      
    const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === invoice.currency)?.symbol || '';
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Invoice #{invoice.invoice_number}</Text>
          <Text style={styles.subHeader}>Status: {invoice.status.toUpperCase()}</Text>
        </View>

        <View style={styles.companyInfo}>
          <Text style={styles.bold}>{invoice.company.company_name}</Text>
          <Text>{invoice.company.headquarters_address}</Text>
          <Text>{`${invoice.company.city}, ${invoice.company.region} ${invoice.company.postal_code}`}</Text>
          <Text>{invoice.company.country}</Text>
          <Text>Tax ID: {invoice.company.tax_id}</Text>
          {invoice.company.economic_activity_code && (
            <Text>Economic Activity Code: {invoice.company.economic_activity_code}</Text>
          )}
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.bold}>Bill To:</Text>
          <Text>{invoice.client.company_name}</Text>
          <Text>{invoice.client.headquarters_address}</Text>
          <Text>{`${invoice.client.city}, ${invoice.client.region} ${invoice.client.postal_code}`}</Text>
          <Text>{invoice.client.country}</Text>
          <Text>Tax ID: {invoice.client.tax_id}</Text>
        </View>

        <View style={styles.section}>
          <Text>Issue Date: {formatDate(invoice.issue_date)}</Text>
          <Text>Due Date: {formatDate(invoice.due_date)}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCell}><Text>Reference</Text></View>
            <View style={styles.tableCell}><Text>Description</Text></View>
            <View style={styles.tableCell}><Text>Quantity</Text></View>
            <View style={styles.tableCell}><Text>Unit Price</Text></View>
            <View style={styles.tableCell}><Text>Tax Rate</Text></View>
            <View style={styles.tableCell}><Text>Total</Text></View>
          </View>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}><Text>{item.item_reference || '-'}</Text></View>
              <View style={styles.tableCell}><Text>{item.description}</Text></View>
              <View style={styles.tableCell}>
                <Text>{`${item.quantity} ${item.unit_of_measure}`}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formatCurrency(item.unit_price)}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{`${item.tax_rate}%`}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formatCurrency(item.total_with_tax)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <Text>Subtotal: {formatCurrency(invoice.subtotal)}</Text>
          {invoice.items.some(item => item.discount_amount > 0) && (
            <Text>Discounts: {formatCurrency(invoice.items.reduce((sum, item) => sum + item.discount_amount, 0))}</Text>
          )}
          <Text>Tax: {formatCurrency(invoice.tax_total)}</Text>
          <Text style={styles.bold}>Total: {formatCurrency(invoice.total)}</Text>
        </View>

        {(invoice.exchange_rate_usd_to_eur || invoice.exchange_rate_usd_to_aoa || invoice.exchange_rate_eur_to_aoa) && (
          <View style={styles.exchangeRates}>
            <Text style={styles.bold}>Exchange Rates:</Text>
            {invoice.exchange_rate_usd_to_eur && (
              <Text>USD/EUR: {invoice.exchange_rate_usd_to_eur}</Text>
            )}
            {invoice.exchange_rate_usd_to_aoa && (
              <Text>USD/AOA: {invoice.exchange_rate_usd_to_aoa}</Text>
            )}
            {invoice.exchange_rate_eur_to_aoa && (
              <Text>EUR/AOA: {invoice.exchange_rate_eur_to_aoa}</Text>
            )}
          </View>
        )}

        {invoice.notes && (
          <View style={[styles.section, { marginTop: 20 }]}>
            <Text style={styles.bold}>Notes:</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Language: {invoice.language.toUpperCase()}</Text>
          {invoice.company.bank_name_usd && (
            <Text>USD Bank Details: {invoice.company.bank_name_usd} - {invoice.company.bank_account_number_usd}</Text>
          )}
          {invoice.company.bank_name_eur && (
            <Text>EUR Bank Details: {invoice.company.bank_name_eur} - {invoice.company.bank_account_number_eur}</Text>
          )}
          {invoice.company.bank_name_aoa && (
            <Text>AOA Bank Details: {invoice.company.bank_name_aoa} - {invoice.company.bank_account_number_aoa}</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

