import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import StatusBadge from '@components/StatusBadge';
import { formatCurrency, formatDate } from '@utils/formatters';

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

        <View style={styles.cardFooter}>
          <View style={styles.metaInfo}>
            <Paragraph style={styles.metaText}>{formatDate(order.createdAt)}</Paragraph>
            <Paragraph style={styles.metaText}>
              {order.itemCount || 0} items
            </Paragraph>
          </View>
          <Title style={styles.totalPrice}>{formatCurrency(order.totalAmount)}</Title>
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 14,
    color: '#666',
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

