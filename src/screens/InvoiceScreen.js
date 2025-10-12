import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Divider, DataTable } from 'react-native-paper';
import { formatCurrency, formatDate } from '../utils/formatters';

// Sample invoice data
const SAMPLE_INVOICE = {
  id: '1',
  invoiceNumber: 'INV-001',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerAddress: '123 Main St, City, State 12345',
  issueDate: '2025-09-01',
  dueDate: '2025-09-15',
  status: 'paid',
  items: [
    { id: '1', description: 'Product A', quantity: 2, unitPrice: 250.00 },
    { id: '2', description: 'Product B', quantity: 1, unitPrice: 500.00 },
    { id: '3', description: 'Service C', quantity: 5, unitPrice: 50.00 },
  ],
  subtotal: 1250.00,
  tax: 0,
  total: 1250.00,
};

const InvoiceScreen = ({ navigation, route }) => {
  const invoiceId = route.params?.invoiceId;
  const [invoice] = useState(SAMPLE_INVOICE);
  const [loading, setLoading] = useState(false);

  const handleMarkAsPaid = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Invoice marked as paid');
      setLoading(false);
    }, 1000);
  };

  const handleDownload = () => {
    console.log('Download invoice');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Invoice Details" />
        <Appbar.Action icon="download" onPress={handleDownload} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.invoiceNumber}>{invoice.invoiceNumber}</Title>
            
            <View style={styles.section}>
              <Paragraph style={styles.sectionTitle}>Bill To:</Paragraph>
              <Title>{invoice.customerName}</Title>
              <Paragraph>{invoice.customerEmail}</Paragraph>
              <Paragraph>{invoice.customerAddress}</Paragraph>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.datesRow}>
              <View style={styles.dateColumn}>
                <Paragraph style={styles.label}>Issue Date</Paragraph>
                <Paragraph>{formatDate(invoice.issueDate)}</Paragraph>
              </View>
              <View style={styles.dateColumn}>
                <Paragraph style={styles.label}>Due Date</Paragraph>
                <Paragraph>{formatDate(invoice.dueDate)}</Paragraph>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Paragraph style={styles.sectionTitle}>Items</Paragraph>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Description</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Price</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
              </DataTable.Header>

              {invoice.items.map((item) => (
                <DataTable.Row key={item.id}>
                  <DataTable.Cell>{item.description}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {formatCurrency(item.unitPrice)}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>

            <Divider style={styles.divider} />

            <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                <Paragraph>Subtotal:</Paragraph>
                <Paragraph>{formatCurrency(invoice.subtotal)}</Paragraph>
              </View>
              <View style={styles.totalRow}>
                <Paragraph>Tax:</Paragraph>
                <Paragraph>{formatCurrency(invoice.tax)}</Paragraph>
              </View>
              <View style={styles.totalRow}>
                <Title>Total:</Title>
                <Title style={styles.totalAmount}>
                  {formatCurrency(invoice.total)}
                </Title>
              </View>
            </View>
          </Card.Content>
        </Card>

        {invoice.status !== 'paid' && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Mark as Paid
          </Button>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  divider: {
    marginVertical: 16,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateColumn: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalsSection: {
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 8,
  },
});

export default InvoiceScreen;

