import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
} from 'react-native';
import { IconButton, Surface, Divider, Button, Avatar } from 'react-native-paper';
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
  const totalAmount = parseFloat((subtotal + taxAmount - discountAmount).toFixed(2));

  const handleCreateInvoice = async () => {
    const invoiceData = {
      customerId: customer.id,
      totalAmount: totalAmount.toFixed(2),
      status: 'DRAFT',
      issueDate: new Date().toISOString(),
      items: cart.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxAmount: item.taxAmount,
        netAmount: item.totalPrice + item.taxAmount,
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
        showSnackbar(result.error || 'Failed to create invoice.', 'error');
      }
    } catch (error) {
      showSnackbar('A system error occurred.', 'error');
    }
  };

  return (
    <ScreenTemplate
      showBackButton
      title="Review Invoice"
      subtitle="Check details before sending"
      headerAction={
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Final Step</Text>
        </View>
      }
      footer={
        <Surface style={styles.footer} elevation={8}>
          <View style={styles.footerTotalBox}>
            <Text style={styles.footerLabel}>Total Amount</Text>
            <Text style={styles.footerAmount}>{formatCurrency(totalAmount)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.createButton, loading && styles.buttonDisabled]}
            onPress={handleCreateInvoice}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>{loading ? 'Generating...' : 'Confirm'}</Text>
            <IconButton icon="check-all" iconColor="#fff" size={20} />
          </TouchableOpacity>
        </Surface>
      }
    >
      {/* Customer Summary */}
      <Text style={styles.sectionTitle}>Bill To</Text>
      <Surface style={styles.customerCard} elevation={1}>
        <View style={styles.customerRow}>
          <Avatar.Text
            size={40}
            label={customer.name.substring(0, 2).toUpperCase()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerSub}>{customer.email}</Text>
            <Text style={styles.customerSub}>{formatPhoneNumber(customer.phone)}</Text>
          </View>
        </View>
      </Surface>

      {/* Items List */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Items ({cart.length})</Text>
      {cart.map((item, index) => (
        <View key={item.variantId || index} style={styles.itemRow}>
          <View style={styles.itemDetails}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.variantName}>
              {item.variantName} x {item.quantity}
            </Text>
          </View>
          <Text style={styles.itemPrice}>{formatCurrency(item.totalPrice)}</Text>
        </View>
      ))}

      <Divider style={styles.divider} />

      {/* Totals Section */}
      <CartSummary
        subtotal={subtotal}
        tax={taxAmount}
        discount={discountAmount}
        total={totalAmount}
        couponCode={coupon?.code}
        containerStyle={styles.summaryContainer}
      />

      {/* Remarks Input */}
      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Remarks</Text>
      <Surface style={styles.remarksCard} elevation={1}>
        <RNTextInput
          value={remarks}
          onChangeText={setRemarks}
          placeholder="Add internal notes or customer message..."
          placeholderTextColor="#AAA"
          multiline
          style={styles.remarksInput}
        />
      </Surface>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 20,
  },
  stepText: { fontSize: 11, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#BBB',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  customerCard: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#F8F8F8',
  },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#F0FFFC' },
  avatarLabel: { color: '#4FD3B5', fontWeight: 'bold' },
  customerInfo: { marginLeft: 15 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  customerSub: { fontSize: 12, color: '#888', marginTop: 1 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  productName: { fontSize: 14, fontWeight: '700', color: '#333' },
  variantName: { fontSize: 12, color: '#999', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#222' },
  divider: { marginVertical: 10, backgroundColor: '#F0F0F0' },
  summaryContainer: { backgroundColor: 'transparent', paddingHorizontal: 0 },
  remarksCard: { borderRadius: 18, backgroundColor: '#F9F9F9', padding: 12 },
  remarksInput: { fontSize: 14, color: '#333', minHeight: 80, textAlignVertical: 'top' },
  footer: {
    height: 100,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 8,
  },
  footerTotalBox: { flex: 1 },
  footerLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase' },
  footerAmount: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  createButton: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    height: 55,
    borderRadius: 18,
  },
  buttonDisabled: { opacity: 0.7 },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default InvoiceReviewScreen;
