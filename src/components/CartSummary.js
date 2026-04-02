import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Divider, Chip } from 'react-native-paper';
import { formatCurrency } from '@utils/formatters';

/**
 * CartSummary Component
 * Invoice creation cart summary
 */
const CartSummary = ({ items = [], discount = 0, couponCode = null, style }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const tax = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  const total = subtotal + tax - discount;

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <Title style={styles.title}>Order Summary</Title>

        <View style={styles.row}>
          <Paragraph>Items ({items.length})</Paragraph>
          <Paragraph>{formatCurrency(subtotal)}</Paragraph>
        </View>

        {tax > 0 && (
          <View style={styles.row}>
            <Paragraph>Tax</Paragraph>
            <Paragraph>{formatCurrency(tax)}</Paragraph>
          </View>
        )}

        {discount > 0 && (
          <View style={styles.row}>
            <View style={styles.discountRow}>
              <Paragraph>Discount</Paragraph>
              {couponCode && (
                <Chip mode="outlined" compact style={styles.couponChip}>
                  {couponCode}
                </Chip>
              )}
            </View>
            <Paragraph style={styles.discountAmount}>-{formatCurrency(discount)}</Paragraph>
          </View>
        )}

        <Divider style={styles.divider} />

        <View style={styles.row}>
          <Title style={styles.totalLabel}>Total</Title>
          <Title style={styles.totalAmount}>{formatCurrency(total)}</Title>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponChip: {
    height: 24,
  },
  discountAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default CartSummary;
