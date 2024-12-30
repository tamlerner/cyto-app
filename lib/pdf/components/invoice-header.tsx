import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';
import type { Company } from '@/lib/types';

interface InvoiceHeaderProps {
  company: Company;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
}

export function InvoiceHeader({ company, invoiceNumber, issueDate, dueDate }: InvoiceHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.companyHeader}>
        <Text style={styles.companyName}>{company.company_name}</Text>
        <Text style={styles.companyDetails}>{company.tax_id}</Text>
        <Text style={styles.companyDetails}>{company.headquarters_address}</Text>
        <Text style={styles.companyDetails}>
          {company.city}, {company.region} {company.postal_code}
        </Text>
        <Text style={styles.companyDetails}>{company.country}</Text>
      </View>
      <View>
        <Text style={styles.documentTitle}>INVOICE</Text>
        <Text style={styles.companyDetails}>#{invoiceNumber}</Text>
        <Text style={styles.companyDetails}>Issue Date: {issueDate}</Text>
        <Text style={styles.companyDetails}>Due Date: {dueDate}</Text>
      </View>
    </View>
  );
}