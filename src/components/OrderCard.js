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
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Title style={styles.orderNumber}>
            {order.orderNumber || `Order #${order.id?.slice(-8)}`}
          </Title>
          <StatusBadge status={order.status} />
        </View>
        
        {order.customer && (
          <Paragraph style={styles.customerName}>{order.customer.name}</Paragraph>
        )}
        
        <View style={styles.divider} />
        
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Paragraph style={styles.label}>Total</Paragraph>
            <Title style={styles.amount}>
              {formatCurrency(order.total || order.totalAmount || 0)}
            </Title>
          </View>
          <View style={styles.footerItemRight}>
            <Paragraph style={styles.label}>Date</Paragraph>
            <Paragraph style={styles.dateText}>{formatDate(order.createdAt)}</Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
    elevation: 0,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  customerName: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flex: 1,
  },
  footerItemRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 11,
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  dateText: {
    fontSize: 12,
    color: '#1a1a1a',
  },
});

export default OrderCard;

