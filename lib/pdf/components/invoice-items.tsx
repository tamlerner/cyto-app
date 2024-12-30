import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';
import { formatCurrency } from '@/lib/utils/currency';
import type { InvoiceItem } from '@/lib/types';

interface InvoiceItemsProps {
  items: InvoiceItem[];
  currency: string;
}

export function InvoiceItems({ items, currency }: InvoiceItemsProps) {
  return (
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
            {formatCurrency(item.unit_price, currency)}
          </Text>
          <Text style={styles.amount}>
            {formatCurrency(item.quantity * item.unit_price, currency)}
          </Text>
        </View>
      ))}
    </View>
  );
}