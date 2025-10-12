import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Appbar, Divider, DataTable, ActivityIndicator } from 'react-native-paper';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useOrders } from '../hooks';
import { useSnackbar } from '../hooks/useSnackbar';
import { StatusBadge, EmptyState } from '../components';

const OrderDetailScreen = ({ navigation, route }) => {
  const orderId = route.params?.orderId;
  const customerId = route.params?.customerId; // Optional, needed for API call
  
  const [localOrder, setLocalOrder] = useState(null);
  
  const { order, loading, fetchOrderById } = useOrders();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setLocalOrder(order);
    }
  }, [order]);

  const loadOrder = async () => {
    // Note: Orders API requires customerId or sessionId
    // For admin, you'd need to handle this differently
    const params = customerId ? { customerId } : {};
    const result = await fetchOrderById(orderId, params);
    if (!result.success) {
      showSnackbar(result.error || 'Failed to load order', 'error');
      navigation.goBack();
    }
  };

  if (loading && !localOrder) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <View style={styles.headerLogo}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (!localOrder) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <View style={styles.headerLogo}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Order Details" />
        </Appbar.Header>
        <EmptyState
          icon="cart-outline"
          title="Order not found"
          message="Unable to load order details"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Order Details" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Title style={styles.orderNumber}>
                {localOrder.orderNumber || `#${localOrder.id?.slice(-8)}`}
              </Title>
              <StatusBadge status={localOrder.status} />
            </View>

            {localOrder.customer && (
              <View style={styles.section}>
                <Paragraph style={styles.sectionTitle}>Customer:</Paragraph>
                <Title>{localOrder.customer.name}</Title>
                {localOrder.customer.email && (
                  <Paragraph>{localOrder.customer.email}</Paragraph>
                )}
                {localOrder.customer.phone && (
                  <Paragraph>{localOrder.customer.phone}</Paragraph>
                )}
              </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Paragraph style={styles.label}>Order Date:</Paragraph>
              <Paragraph>{formatDate(localOrder.createdAt)}</Paragraph>
            </View>

            {localOrder.confirmedAt && (
              <View style={styles.row}>
                <Paragraph style={styles.label}>Confirmed:</Paragraph>
                <Paragraph>{formatDate(localOrder.confirmedAt)}</Paragraph>
              </View>
            )}

            <Divider style={styles.divider} />

            {localOrder.shippingAddress && (
              <View style={styles.section}>
                <Paragraph style={styles.sectionTitle}>Shipping Address:</Paragraph>
                <Paragraph>{localOrder.shippingAddress.name}</Paragraph>
                <Paragraph>{localOrder.shippingAddress.address}</Paragraph>
                <Paragraph>
                  {localOrder.shippingAddress.city}, {localOrder.shippingAddress.state} {localOrder.shippingAddress.pincode}
                </Paragraph>
              </View>
            )}

            <Divider style={styles.divider} />

            {localOrder.items && localOrder.items.length > 0 && (
              <>
                <Paragraph style={styles.sectionTitle}>Order Items:</Paragraph>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Product</DataTable.Title>
                    <DataTable.Title numeric>Qty</DataTable.Title>
                    <DataTable.Title numeric>Total</DataTable.Title>
                  </DataTable.Header>

                  {localOrder.items.map((item) => (
                    <DataTable.Row key={item.id}>
                      <DataTable.Cell>
                        {item.productName || item.product?.name}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        {formatCurrency(item.netAmount || item.totalPrice)}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>

                <Divider style={styles.divider} />

                <View style={styles.totalsSection}>
                  <View style={styles.totalRow}>
                    <Paragraph>Subtotal:</Paragraph>
                    <Paragraph>{formatCurrency(localOrder.subtotal || 0)}</Paragraph>
                  </View>
                  {localOrder.totalDiscount > 0 && (
                    <View style={styles.totalRow}>
                      <Paragraph>Discount:</Paragraph>
                      <Paragraph>-{formatCurrency(localOrder.totalDiscount)}</Paragraph>
                    </View>
                  )}
                  {localOrder.totalTax > 0 && (
                    <View style={styles.totalRow}>
                      <Paragraph>Tax:</Paragraph>
                      <Paragraph>{formatCurrency(localOrder.totalTax)}</Paragraph>
                    </View>
                  )}
                  <Divider style={styles.divider} />
                  <View style={styles.totalRow}>
                    <Title>Total:</Title>
                    <Title style={styles.totalAmount}>
                      {formatCurrency(localOrder.total)}
                    </Title>
                  </View>
                </View>
              </>
            )}

            {localOrder.payment && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Paragraph style={styles.sectionTitle}>Payment:</Paragraph>
                  <View style={styles.row}>
                    <Paragraph>Method:</Paragraph>
                    <Paragraph>{localOrder.payment.method}</Paragraph>
                  </View>
                  <View style={styles.row}>
                    <Paragraph>Status:</Paragraph>
                    <StatusBadge status={localOrder.payment.status} style={styles.paymentBadge} />
                  </View>
                  {localOrder.payment.paidAt && (
                    <View style={styles.row}>
                      <Paragraph>Paid At:</Paragraph>
                      <Paragraph>{formatDate(localOrder.payment.paidAt)}</Paragraph>
                    </View>
                  )}
                </View>
              </>
            )}

            {localOrder.shipment && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Paragraph style={styles.sectionTitle}>Shipment:</Paragraph>
                  <View style={styles.row}>
                    <Paragraph>Status:</Paragraph>
                    <StatusBadge status={localOrder.shipment.status} style={styles.shipmentBadge} />
                  </View>
                  {localOrder.shipment.trackingNumber && (
                    <View style={styles.row}>
                      <Paragraph>Tracking:</Paragraph>
                      <Paragraph>{localOrder.shipment.trackingNumber}</Paragraph>
                    </View>
                  )}
                  {localOrder.shipment.carrier && (
                    <View style={styles.row}>
                      <Paragraph>Carrier:</Paragraph>
                      <Paragraph>{localOrder.shipment.carrier}</Paragraph>
                    </View>
                  )}
                  {localOrder.shipment.estimatedDelivery && (
                    <View style={styles.row}>
                      <Paragraph>Est. Delivery:</Paragraph>
                      <Paragraph>{formatDate(localOrder.shipment.estimatedDelivery)}</Paragraph>
                    </View>
                  )}
                </View>
              </>
            )}

            {localOrder.timeline && localOrder.timeline.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Paragraph style={styles.sectionTitle}>Timeline:</Paragraph>
                  {localOrder.timeline.map((event, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <Paragraph style={styles.timelineDate}>
                        {formatDate(event.timestamp)}
                      </Paragraph>
                      <Paragraph style={styles.timelineDesc}>
                        {event.description}
                      </Paragraph>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
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
    color: '#4CAF50',
  },
  paymentBadge: {
    height: 24,
  },
  shipmentBadge: {
    height: 24,
  },
  timelineItem: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#2196F3',
  },
  timelineDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  timelineDesc: {
    fontSize: 14,
  },
});

export default OrderDetailScreen;

