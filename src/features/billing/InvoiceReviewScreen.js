import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Divider, DataTable, TextInput } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useInvoices } from '@hooks';
import { useSnackbar } from '@hooks/useSnackbar';
import { CartSummary } from '@components';
import { formatPhoneNumber, formatCurrency } from '@utils/formatters';

const InvoiceReviewScreen = ({ navigation, route }) => {
  const { customer, cart, coupon, discountAmount } = route.params;
  const [remarks, setRemarks] = useState('');
  
  const { loading, createInvoice } = useInvoices();
  const { showSnackbar } = useSnackbar();

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = cart.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleCreateInvoice = async () => {
    const invoiceData = {
      customerId: customer.id,
      totalAmount,
      status: 'DRAFT',
      issueDate: new Date().toISOString(),
      remarks: remarks || undefined,
      // Note: The order creation would typically be handled by the backend
      // This is a simplified version - in production, you'd create an order first
    };

    const result = await createInvoice(invoiceData);
    
    if (result.success) {
      showSnackbar('Invoice created successfully', 'success');
      // Navigate to the newly created invoice
      navigation.reset({
        index: 1,
        routes: [
          { name: ROUTES.CUSTOMER_LIST },
          { name: ROUTES.INVOICE, params: { invoiceId: result.data.id } },
        ],
      });
    } else {
      showSnackbar(result.error || 'Failed to create invoice', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLogo}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Review Invoice"
          subtitle={`Step 4 of 4 • ${customer.name}`}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Customer Details</Title>
            <Paragraph style={styles.customerName}>{customer.name}</Paragraph>
            {customer.email && (
              <Paragraph style={styles.text}>{customer.email}</Paragraph>
            )}
            {customer.phone && (
              <Paragraph style={styles.text}>{formatPhoneNumber(customer.phone)}</Paragraph>
            )}
            {customer.companyName && (
              <Paragraph style={styles.text}>{customer.companyName}</Paragraph>
            )}
            {customer.gstNumber && (
              <Paragraph style={styles.text}>GST: {customer.gstNumber}</Paragraph>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Items ({cart.length})</Title>
            
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Product</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
              </DataTable.Header>

              {cart.map((item) => (
                <DataTable.Row key={item.variantId}>
                  <DataTable.Cell>
                    <View>
                      <Paragraph>{item.productName}</Paragraph>
                      <Paragraph style={styles.variantName}>{item.variantName}</Paragraph>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric style={styles.priceCell}>
                    {formatCurrency(item.totalPrice)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        <CartSummary
          items={cart}
          discount={discountAmount}
          couponCode={coupon?.code}
          style={styles.card}
        />

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Remarks (Optional)"
              mode="outlined"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={3}
              placeholder="Add any additional notes or instructions..."
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleCreateInvoice}
          loading={loading}
          disabled={loading}
          style={styles.createButton}
        >
          Create Invoice
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 4,
  },
  logo: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  text: {
    color: '#666',
    marginBottom: 2,
  },
  variantName: {
    fontSize: 12,
    color: '#666',
  },
  priceCell: {
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  createButton: {
    paddingVertical: 8,
    borderRadius: 4,
  },
});

export default InvoiceReviewScreen;

