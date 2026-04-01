import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, DataTable, TextInput, Text } from 'react-native-paper';
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
  // Ensure totalAmount is a number and rounded to 2 decimal places to avoid API precision errors
  const totalAmount = parseFloat((subtotal + taxAmount - discountAmount).toFixed(2));

  const handleCreateInvoice = async () => {
    const invoiceData = {
      customerId: customer.id,
      totalAmount: totalAmount.toFixed(2),
      status: 'DRAFT',
      issueDate: new Date().toISOString(),
      items: cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxAmount: item.taxAmount,
        netAmount: item.totalPrice + item.taxAmount
      })),
      remarks: remarks || undefined,
    };

    try {
      const result = await createInvoice(invoiceData);

      if (result.success) {
        showSnackbar('Invoice created successfully', 'success');
        navigation.reset({
          index: 1,
          routes: [
            { name: ROUTES.CUSTOMER_LIST },
            { name: ROUTES.INVOICE_DETAILS, params: { invoiceId: result.data.id } },
          ],
        });
      } else {
        // Handling the 500 error or validation errors from the API
        showSnackbar(result.error || 'Failed to create invoice. Please check network.', 'error');
      }
    } catch (error) {
      showSnackbar('A system error occurred.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Review Invoice"
          subtitle={`Step 4 of 4 • ${customer.name}`}
          titleStyle={styles.headerTitle}
        />
        <View style={styles.headerLogo}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Summary Card */}
        <Card style={styles.card} elevation={0}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Customer Details</Title>
            <Paragraph style={styles.customerName}>{customer.name}</Paragraph>
            <Text style={styles.text}>{customer.email}</Text>
            <Text style={styles.text}>{formatPhoneNumber(customer.phone)}</Text>
            {customer.companyName && <Text style={styles.text}>{customer.companyName}</Text>}
          </Card.Content>
        </Card>

        {/* Items Table Card */}
        <Card style={styles.card} elevation={0}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Items ({cart.length})</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Product</DataTable.Title>
                <DataTable.Title numeric>Qty</DataTable.Title>
                <DataTable.Title numeric>Total</DataTable.Title>
              </DataTable.Header>

              {cart.map((item, index) => (
                <DataTable.Row key={item.variantId || index}>
                  <DataTable.Cell>
                    <View style={styles.itemInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                      <Text style={styles.variantName}>{item.variantName}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.priceText}>{formatCurrency(item.totalPrice)}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        {/* Totals Section */}
        <CartSummary
          subtotal={subtotal}
          tax={taxAmount}
          discount={discountAmount}
          total={totalAmount}
          couponCode={coupon?.code}
          containerStyle={styles.card}
        />

        {/* Remarks Input */}
        <Card style={styles.card} elevation={0}>
          <Card.Content>
            <TextInput
              label="Remarks (Optional)"
              mode="outlined"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={3}
              placeholder="Add notes for the customer..."
              outlineColor="#f0f0f0"
              activeOutlineColor="#6200ee"
            />
          </Card.Content>
        </Card>

        {/* Bottom Padding for Scroll */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Persistent Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTotalContainer}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>{formatCurrency(totalAmount)}</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleCreateInvoice}
          loading={loading}
          disabled={loading}
          style={styles.createButton}
          contentStyle={styles.buttonContent}
        >
          Confirm & Create
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#ffffff', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerLogo: { marginRight: 16 },
  logo: { width: 32, height: 32 },
  content: { flex: 1, padding: 16 },
  card: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, borderOrigin: '1px solid #eee' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  customerName: { fontSize: 17, fontWeight: '700', color: '#000' },
  text: { color: '#666', marginTop: 2 },
  itemInfo: { paddingVertical: 8 },
  productName: { fontSize: 14, fontWeight: '500' },
  variantName: { fontSize: 12, color: '#888' },
  priceText: { fontWeight: '600' },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footerTotalContainer: { flex: 1 },
  footerTotalLabel: { fontSize: 12, color: '#666' },
  footerTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#6200ee' },
  createButton: { flex: 1.2, borderRadius: 8 },
  buttonContent: { height: 48 }
});

export default InvoiceReviewScreen;