import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { SUPPORTED_CURRENCIES } from '@/lib/constants';
import type { Invoice } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    color: '#000000'
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold'
  },
  infoGrid: {
    marginBottom: 40
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  infoLabel: {
    fontSize: 9,
    width: 100,
    color: '#666'
  },
  infoValue: {
    fontSize: 9,
    color: '#000'
  },
  addresses: {
    flexDirection: 'row',
    marginBottom: 60
  },
  addressBlock: {
    flex: 1
  },
  companyName: {
    fontSize: 9,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  addressText: {
    fontSize: 9,
    marginBottom: 4,
    lineHeight: 1.4
  },
  table: {
    width: '100%'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#272e68',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  descriptionCol: {
    flex: 4
  },
  qtyCol: {
    flex: 1,
    textAlign: 'right'
  },
  priceCol: {
    flex: 2,
    textAlign: 'right'
  },
  vatCol: {
    flex: 1,
    textAlign: 'right'
  },
  totalCol: {
    flex: 2,
    textAlign: 'right'
  },
  headerText: {
    fontSize: 9,
    color: 'white'
  },
  cellText: {
    fontSize: 9
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4
  },
  totalLabel: {
    fontSize: 9,
    marginRight: 40,
    width: 120
  },
  totalValue: {
    fontSize: 9,
    width: 100,
    textAlign: 'right'
  },
  notes: {
    marginTop: 40,
    fontSize: 8,
    color: '#666',
    lineHeight: 1.4
  },
  paymentDetails: {
    marginTop: 40
  },
  paymentTitle: {
    fontSize: 9,
    marginBottom: 15,
    fontWeight: 'bold'
  },
  paymentGrid: {
    marginBottom: 40
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  paymentLabel: {
    fontSize: 9,
    width: 120,
    color: '#666'
  },
  paymentValue: {
    fontSize: 9
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#666'
  }
});

export default function InvoicePDF({ invoice }: { invoice: Invoice }) {
  if (!invoice || !invoice.client || !invoice.company) {
    return null;
  }

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={[styles.title, { fontWeight: 'bold' }]}>Invoice</Text>

        {/* Invoice Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>Invoice number</Text>
            <Text style={styles.infoValue}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>Issue date</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.issue_date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { fontWeight: 'bold' }]}>Due date</Text>
            <Text style={styles.infoValue}>{formatDate(invoice.due_date)}</Text>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addresses}>
          <View style={styles.addressBlock}>
            <Text style={[styles.companyName, { fontWeight: 'bold' }]}>{invoice.company.company_name}</Text>
            <Text style={styles.addressText}>{invoice.company.headquarters_address}</Text>
            <Text style={styles.addressText}>{invoice.company.postal_code} {invoice.company.city}, {invoice.company.region}</Text>
            <Text style={styles.addressText}>{invoice.company.email}</Text>
            <Text style={styles.addressText}>{invoice.company.tax_id}</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={[styles.companyName, { fontWeight: 'bold' }]}>{invoice.client.company_name}</Text>
            <Text style={styles.addressText}>{invoice.client.headquarters_address}</Text>
            <Text style={styles.addressText}>{invoice.client.postal_code} {invoice.client.city}, {invoice.client.region}</Text>
            <Text style={styles.addressText}>{invoice.client.tax_id}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.descriptionCol]}>Description</Text>
            <Text style={[styles.headerText, styles.qtyCol]}>Qty</Text>
            <Text style={[styles.headerText, styles.priceCol]}>Unit price</Text>
            <Text style={[styles.headerText, styles.vatCol]}>VAT (%)</Text>
            <Text style={[styles.headerText, styles.totalCol]}>Total excl. VAT</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cellText, styles.descriptionCol]}>{item.description}</Text>
              <Text style={[styles.cellText, styles.qtyCol]}>{item.quantity}</Text>
              <Text style={[styles.cellText, styles.priceCol]}>${item.unit_price.toFixed(2)}</Text>
              <Text style={[styles.cellText, styles.vatCol]}>{item.tax_rate} %</Text>
              <Text style={[styles.cellText, styles.totalCol]}>${item.total_with_tax.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total excl. VAT</Text>
            <Text style={styles.totalValue}>${invoice.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total VAT amount</Text>
            <Text style={styles.totalValue}>${invoice.tax_total.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total incl. VAT</Text>
            <Text style={styles.totalValue}>${invoice.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentTitle}>Payment details</Text>
          <View style={styles.paymentGrid}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Beneficiary name</Text>
              <Text style={styles.paymentValue}>{invoice.company.company_name}</Text>
            </View>
            {invoice.company.bic && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>BIC</Text>
                <Text style={styles.paymentValue}>{invoice.company.bic}</Text>
              </View>
            )}
            {invoice.company.iban && (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>IBAN</Text>
                <Text style={styles.paymentValue}>{invoice.company.iban}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{invoice.company.company_name}</Text>
          <Text>{invoice.invoice_number} · 1/1</Text>
        </View>
      </Page>
    </Document>
  );
}