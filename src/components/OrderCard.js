import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * OrderCard Component
 * Order list item display
 */
const OrderCard = ({ order, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.orderNumber}>
            {order.orderNumber || `Order #${order.id?.slice(-8)}`}
          </Title>
          <StatusBadge status={order.status} style={styles.statusBadge} />
        </View>
        
        {order.customer && (
          <Paragraph style={styles.customerName}>{order.customer.name}</Paragraph>
        )}
        
        <View style={styles.cardRow}>
          <Paragraph style={styles.label}>Amount:</Paragraph>
          <Title style={styles.amount}>
            {formatCurrency(order.total || order.totalAmount || 0)}
          </Title>
        </View>
        
        <View style={styles.cardRow}>
          <Paragraph style={styles.label}>Date:</Paragraph>
          <Paragraph>{formatDate(order.createdAt)}</Paragraph>
        </View>
        
        {order.payment && (
          <View style={styles.cardRow}>
            <Paragraph style={styles.label}>Payment:</Paragraph>
            <StatusBadge
              status={order.payment.status}
              style={styles.paymentBadge}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    height: 28,
  },
  customerName: {
    color: '#666',
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: '#666',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentBadge: {
    height: 24,
  },
});

export default OrderCard;

