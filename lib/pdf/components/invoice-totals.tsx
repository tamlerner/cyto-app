import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';
import { formatCurrency } from '@/lib/utils/currency';

interface InvoiceTotalsProps {
  subtotal: number;
  taxTotal: number;
  total: number;
  currency: string;
}

export function InvoiceTotals({ subtotal, taxTotal, total, currency }: InvoiceTotalsProps) {
  return (
    <View style={styles.totals}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal</Text>
        <Text style={styles.totalValue}>
          {formatCurrency(subtotal, currency)}
        </Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tax</Text>
        <Text style={styles.totalValue}>
          {formatCurrency(taxTotal, currency)}
        </Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>
          {formatCurrency(total, currency)}
        </Text>
      </View>
    </View>
  );
}