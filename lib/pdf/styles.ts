import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Roboto',
    color: '#1a1a1a',
    backgroundColor: '#ffffff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  companyHeader: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyDetails: {
    marginBottom: 2,
  },
  documentTitle: {
    fontSize: 24,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    marginBottom: 2,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  description: { 
    flex: 4,
    paddingRight: 8,
  },
  quantity: { 
    flex: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  price: { 
    flex: 2,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: { 
    flex: 2,
    textAlign: 'right',
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
    paddingRight: 8,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
  },
  notes: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  notesTitle: {
    fontSize: 12,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 10,
  },
});