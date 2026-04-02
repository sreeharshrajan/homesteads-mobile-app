import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { IconButton, Surface, Divider, Avatar, ActivityIndicator } from 'react-native-paper';
import { formatCurrency, formatDate } from '@utils/formatters';
import { useOrders } from '@hooks';
import { useSnackbar } from '@hooks/useSnackbar';
import { StatusBadge, EmptyState, ScreenTemplate } from '@components';

const OrderDetailScreen = ({ navigation, route }) => {
  const orderId = route.params?.orderId;
  const customerId = route.params?.customerId;
  const [localOrder, setLocalOrder] = useState(null);

  const { order, loading, fetchOrderById } = useOrders();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (orderId) loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) setLocalOrder(order);
  }, [order]);

  const loadOrder = async () => {
    const params = customerId ? { customerId } : {};
    const result = await fetchOrderById(orderId, params);
    if (!result.success) {
      showSnackbar(result.error || 'Failed to load order', 'error');
      navigation.goBack();
    }
  };

  if (loading && !localOrder) {
    return (
      <View style={styles.loadingFull}>
        <ActivityIndicator size="large" color="#4FD3B5" />
      </View>
    );
  }

  if (!localOrder) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cart-off"
          title="Order Not Found"
          message="Unable to retrieve order details"
        />
      </View>
    );
  }

  return (
    <ScreenTemplate
      showBackButton
      title={localOrder.orderNumber || `#${localOrder.id?.slice(-8)}`}
      subtitle={`Placed on ${formatDate(localOrder.createdAt)}`}
      headerAction={<IconButton icon="dots-vertical" iconColor="#333" />}
      headerContent={
        <View style={styles.badgeWrapper}>
          <StatusBadge status={localOrder.status} />
        </View>
      }
    >
      {/* Customer & Shipping Row */}
      <Text style={styles.sectionLabel}>Customer Information</Text>
      <Surface style={styles.infoCard} elevation={1}>
        <View style={styles.customerRow}>
          <Avatar.Text
            size={40}
            label={localOrder.customer?.name?.substring(0, 2).toUpperCase() || 'CU'}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{localOrder.customer?.name}</Text>
            <Text style={styles.customerSub}>{localOrder.customer?.email}</Text>
          </View>
        </View>
        {localOrder.shippingAddress && (
          <View style={styles.addressBox}>
            <Divider style={styles.innerDivider} />
            <Text style={styles.addressLabel}>Shipping Address</Text>
            <Text style={styles.addressText}>
              {localOrder.shippingAddress.address}, {localOrder.shippingAddress.city}
            </Text>
          </View>
        )}
      </Surface>

      {/* Items Section */}
      <Text style={[styles.sectionLabel, { marginTop: 25 }]}>Ordered Items</Text>
      {localOrder.items?.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.itemMain}>
            <Text style={styles.itemName}>{item.productName || item.product?.name}</Text>
            <Text style={styles.itemSub}>Quantity: {item.quantity}</Text>
          </View>
          <Text style={styles.itemTotal}>{formatCurrency(item.netAmount || item.totalPrice)}</Text>
        </View>
      ))}

      <Divider style={styles.divider} />

      {/* Totals Summary */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalLine}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>{formatCurrency(localOrder.subtotal || 0)}</Text>
        </View>
        {localOrder.totalTax > 0 && (
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>{formatCurrency(localOrder.totalTax)}</Text>
          </View>
        )}
        <View style={[styles.totalLine, styles.grandTotalLine]}>
          <Text style={styles.grandTotalLabel}>Order Total</Text>
          <Text style={styles.grandTotalValue}>{formatCurrency(localOrder.total)}</Text>
        </View>
      </View>

      {/* Timeline Section */}
      {localOrder.timeline && localOrder.timeline.length > 0 && (
        <View style={styles.timelineSection}>
          <Text style={styles.sectionLabel}>Order Timeline</Text>
          {localOrder.timeline.map((event, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelinePoint} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDesc}>{event.description}</Text>
                <Text style={styles.timelineDate}>{formatDate(event.timestamp)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  loadingFull: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  badgeWrapper: { alignSelf: 'flex-start', marginTop: 10 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#BBB',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    marginBottom: 20,
  },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#F0FFFC' },
  avatarLabel: { color: '#4FD3B5', fontWeight: 'bold' },
  customerDetails: { marginLeft: 15 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  customerSub: { fontSize: 12, color: '#888' },
  addressBox: { marginTop: 15 },
  innerDivider: { marginBottom: 15, backgroundColor: '#F0F0F0' },
  addressLabel: { fontSize: 11, color: '#BBB', textTransform: 'uppercase', marginBottom: 4 },
  addressText: { fontSize: 13, color: '#555', lineHeight: 18 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemName: { fontSize: 14, fontWeight: '700', color: '#333' },
  itemSub: { fontSize: 12, color: '#999', marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: '#222' },
  divider: { marginVertical: 15, backgroundColor: '#F0F0F0' },
  totalsContainer: { marginTop: 10 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14, color: '#888' },
  totalValue: { fontSize: 14, color: '#333', fontWeight: '600' },
  grandTotalLine: { marginTop: 10, paddingTop: 10 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  grandTotalValue: { fontSize: 22, fontWeight: 'bold', color: '#4FD3B5' },
  timelineSection: { marginTop: 30 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelinePoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4FD3B5',
    marginTop: 5,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#F0F0F0',
    paddingLeft: 15,
    marginLeft: -20,
  },
  timelineDesc: { fontSize: 14, color: '#333', fontWeight: '600' },
  timelineDate: { fontSize: 11, color: '#BBB', marginTop: 2 },
});

export default OrderDetailScreen;
