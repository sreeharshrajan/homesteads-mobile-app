import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Appbar, Chip, Divider, Button, SegmentedButtons, List, Surface, Badge } from 'react-native-paper';
import { ROUTES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import useAuthStore from '../store/authStore';
import { useDashboard } from '../hooks';
import { EmptyState } from '../components';

const DashboardScreen = ({ navigation }) => {
  const [timeRange, setTimeRange] = useState('today');
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  
  const { dashboard, loading, error, fetchDashboard } = useDashboard();

  const loadDashboard = useCallback(() => {
    fetchDashboard({ timeRange });
  }, [timeRange, fetchDashboard]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = () => {
    loadDashboard();
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace(ROUTES.LOGIN);
  };

  const renderStatCard = (title, value, icon, color = '#2196F3', subValue = null) => (
    <Surface style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardHeader}>
          <Paragraph style={styles.statCardTitle}>{title}</Paragraph>
          <List.Icon icon={icon} color={color} style={styles.statCardIcon} />
        </View>
        <Title style={styles.statCardValue}>{value}</Title>
        {subValue && <Paragraph style={styles.statCardSubValue}>{subValue}</Paragraph>}
      </View>
    </Surface>
  );

  const renderOrdersByStatus = () => {
    if (!dashboard?.salesAnalytics?.ordersByStatus) return null;

    const statusColors = {
      COMPLETED: '#4CAF50',
      PENDING: '#FF9800',
      PROCESSING: '#2196F3',
      SHIPPED: '#9C27B0',
      DELIVERED: '#4CAF50',
      CANCELLED: '#F44336',
    };

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Orders by Status</Title>
          <Divider style={styles.divider} />
          {dashboard.salesAnalytics.ordersByStatus.map((item, index) => (
            <View key={index} style={styles.statusRow}>
              <View style={styles.statusInfo}>
                <Chip
                  mode="outlined"
                  style={[styles.statusChip, { borderColor: statusColors[item.status] || '#666' }]}
                  textStyle={{ color: statusColors[item.status] || '#666' }}
                >
                  {item.status}
                </Chip>
                <Paragraph style={styles.statusCount}>{item.count} orders</Paragraph>
              </View>
              <Paragraph style={styles.statusAmount}>
                {formatCurrency(item.totalAmount)}
              </Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderTopProducts = () => {
    if (!dashboard?.salesAnalytics?.topProducts || dashboard.salesAnalytics.topProducts.length === 0) {
      return null;
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Top Products</Title>
          <Divider style={styles.divider} />
          {dashboard.salesAnalytics.topProducts.map((product, index) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Badge style={styles.productBadge}>{index + 1}</Badge>
                <View style={styles.productDetails}>
                  <Paragraph style={styles.productName}>{product.name}</Paragraph>
                  <Paragraph style={styles.productQuantity}>Qty: {product.quantity}</Paragraph>
                </View>
              </View>
              <Paragraph style={styles.productRevenue}>
                {formatCurrency(product.revenue)}
              </Paragraph>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderAlerts = () => {
    if (!dashboard?.alerts) return null;

    const alerts = [
      { label: 'Pending Orders', value: dashboard.alerts.pendingOrders, icon: 'package-variant', color: '#FF9800' },
      { label: 'Pending Invoices', value: dashboard.alerts.pendingInvoices, icon: 'file-document-outline', color: '#2196F3' },
      { label: 'Due Today', value: dashboard.alerts.invoicesDueToday, icon: 'calendar-alert', color: '#F44336' },
      { label: 'Low Stock', value: dashboard.alerts.lowStockAlerts, icon: 'package-down', color: '#F44336' },
    ];

    const hasAlerts = alerts.some(alert => alert.value > 0);
    if (!hasAlerts) return null;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>⚠️ Alerts</Title>
          <Divider style={styles.divider} />
          <View style={styles.alertsGrid}>
            {alerts.map((alert, index) => (
              alert.value > 0 && (
                <Surface key={index} style={[styles.alertCard, { borderLeftColor: alert.color }]}>
                  <List.Icon icon={alert.icon} color={alert.color} style={styles.alertIcon} />
                  <Paragraph style={styles.alertValue}>{alert.value}</Paragraph>
                  <Paragraph style={styles.alertLabel}>{alert.label}</Paragraph>
                </Surface>
              )
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderRecentOrders = () => {
    if (!dashboard?.recentActivities?.orders || dashboard.recentActivities.orders.length === 0) {
      return null;
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Recent Orders</Title>
            <Button mode="text" onPress={() => navigation.navigate(ROUTES.ORDERS)}>
              View All
            </Button>
          </View>
          <Divider style={styles.divider} />
          {dashboard.recentActivities.orders.slice(0, 5).map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: order.id })}
            >
              <View style={styles.orderRow}>
                <View style={styles.orderInfo}>
                  <Paragraph style={styles.orderNumber}>{order.orderNumber}</Paragraph>
                  <Paragraph style={styles.orderCustomer}>{order.customer.name}</Paragraph>
                  <Paragraph style={styles.orderDate}>{formatDate(order.createdAt)}</Paragraph>
                </View>
                <View style={styles.orderRight}>
                  <Paragraph style={styles.orderAmount}>{formatCurrency(order.amount)}</Paragraph>
                  <Chip
                    mode="outlined"
                    style={styles.orderStatusChip}
                    textStyle={{ fontSize: 10 }}
                  >
                    {order.status}
                  </Chip>
                </View>
              </View>
              <Divider style={styles.orderDivider} />
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>
    );
  };

  const renderRecentCustomers = () => {
    if (!dashboard?.recentActivities?.customers || dashboard.recentActivities.customers.length === 0) {
      return null;
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>New Customers</Title>
            <Button mode="text" onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)}>
              View All
            </Button>
          </View>
          <Divider style={styles.divider} />
          {dashboard.recentActivities.customers.slice(0, 5).map((customer) => (
            <View key={customer.id} style={styles.customerRow}>
              <List.Icon icon="account-circle" color="#2196F3" style={styles.customerIcon} />
              <View style={styles.customerInfo}>
                <Paragraph style={styles.customerName}>{customer.name}</Paragraph>
                <Paragraph style={styles.customerEmail}>{customer.email}</Paragraph>
                <Paragraph style={styles.customerDate}>{formatDate(customer.createdAt)}</Paragraph>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <View style={styles.headerLogo}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Appbar.Content title="Dashboard" />
          <Appbar.Action icon="logout" onPress={handleLogout} />
        </Appbar.Header>
        <EmptyState
          icon="alert-circle"
          title="Error loading dashboard"
          message={error}
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
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="account-group" onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)} />
        <Appbar.Action icon="invoice-text-outline" onPress={() => navigation.navigate(ROUTES.BILLING)} />
        {role?.slug === 'super-admin' && (
          <Appbar.Action icon="key-variant" onPress={() => navigation.navigate(ROUTES.API_KEYS)} />
        )}
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <SegmentedButtons
            value={timeRange}
            onValueChange={setTimeRange}
            buttons={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
              { value: 'year', label: 'Year' },
            ]}
            style={styles.timeRangeButtons}
          />
        </View>

        {/* User Welcome */}
        {user && (
          <Surface style={styles.welcomeCard}>
            <Title style={styles.welcomeTitle}>Welcome back, {user.name || user.email}</Title>
            <Paragraph style={styles.welcomeSubtitle}>{role?.name || 'Admin'}</Paragraph>
          </Surface>
        )}

        {/* Stats Grid */}
        {dashboard?.stats && (
          <View style={styles.statsGrid}>
            {renderStatCard(
              'Total Customers',
              dashboard.stats.customers.total.toLocaleString(),
              'account-group',
              '#2196F3'
            )}
            {renderStatCard(
              'Total Products',
              dashboard.stats.products.total.toLocaleString(),
              'package-variant',
              '#4CAF50'
            )}
            {renderStatCard(
              'Total Orders',
              dashboard.stats.orders.total.toLocaleString(),
              'cart',
              '#FF9800'
            )}
            {renderStatCard(
              'Total Revenue',
              formatCurrency(dashboard.stats.revenue.total),
              'currency-inr',
              '#9C27B0',
              `Monthly: ${formatCurrency(dashboard.stats.revenue.monthly)}`
            )}
          </View>
        )}

        {/* Inventory Summary */}
        {dashboard?.inventory && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Inventory</Title>
              <Divider style={styles.divider} />
              <View style={styles.inventoryGrid}>
                <View style={styles.inventoryItem}>
                  <Paragraph style={styles.inventoryLabel}>Total Items</Paragraph>
                  <Title style={styles.inventoryValue}>{dashboard.inventory.totalItems}</Title>
                </View>
                <View style={styles.inventoryItem}>
                  <Paragraph style={styles.inventoryLabel}>Available Stock</Paragraph>
                  <Title style={styles.inventoryValue}>{dashboard.inventory.availableStock}</Title>
                </View>
                <View style={styles.inventoryItem}>
                  <Paragraph style={styles.inventoryLabel}>Low Stock</Paragraph>
                  <Title style={[styles.inventoryValue, styles.inventoryWarning]}>
                    {dashboard.inventory.lowStockItems}
                  </Title>
                </View>
                <View style={styles.inventoryItem}>
                  <Paragraph style={styles.inventoryLabel}>Out of Stock</Paragraph>
                  <Title style={[styles.inventoryValue, styles.inventoryDanger]}>
                    {dashboard.inventory.outOfStockItems}
                  </Title>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Alerts */}
        {renderAlerts()}

        {/* Orders by Status */}
        {renderOrdersByStatus()}

        {/* Top Products */}
        {renderTopProducts()}

        {/* Recent Orders */}
        {renderRecentOrders()}

        {/* Recent Customers */}
        {renderRecentCustomers()}
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
  scrollContent: {
    padding: 16,
  },
  timeRangeContainer: {
    marginBottom: 16,
  },
  timeRangeButtons: {
    backgroundColor: 'white',
  },
  welcomeCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 2,
  },
  statCardContent: {
    flex: 1,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  statCardIcon: {
    margin: 0,
    width: 24,
    height: 24,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardSubValue: {
    fontSize: 11,
    color: '#888',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 12,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  inventoryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  inventoryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  inventoryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inventoryWarning: {
    color: '#FF9800',
  },
  inventoryDanger: {
    color: '#F44336',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusChip: {
    height: 28,
  },
  statusCount: {
    fontSize: 12,
    color: '#666',
  },
  statusAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  productBadge: {
    backgroundColor: '#2196F3',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 12,
    color: '#666',
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  alertsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  alertCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
    elevation: 1,
  },
  alertIcon: {
    margin: 0,
    width: 32,
    height: 32,
  },
  alertValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  alertLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderStatusChip: {
    height: 24,
  },
  orderDivider: {
    marginVertical: 4,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customerIcon: {
    margin: 0,
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  customerDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});

export default DashboardScreen;

