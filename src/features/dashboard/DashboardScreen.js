import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { IconButton, Surface, Avatar } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { formatCurrency, formatDate } from '@utils/formatters';
import useAuthStore from '@store/authStore';
import { useDashboard } from '@hooks';

const DashboardScreen = ({ navigation }) => {
  const { user, role } = useAuthStore();
  const { dashboard, loading, fetchDashboard: refetch } = useDashboard({ timeRange: 'today' });

  const renderInventoryStatus = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Inventory Status</Text>
      <View style={styles.inventoryGrid}>
        <Surface style={[styles.invBox, { backgroundColor: '#F0FFFC' }]} elevation={0}>
          <Text style={[styles.invValue, { color: '#4FD3B5' }]}>{dashboard?.inventory?.availableStock || 0}</Text>
          <Text style={styles.invLabel}>In Stock</Text>
        </Surface>
        <Surface style={[styles.invBox, { backgroundColor: '#FFF5F7' }]} elevation={0}>
          <Text style={[styles.invValue, { color: '#FF4B7D' }]}>{dashboard?.inventory?.lowStockItems || 0}</Text>
          <Text style={styles.invLabel}>Low Stock</Text>
        </Surface>
      </View>
    </View>
  );

  const renderPendingInvoices = () => {
    if (!dashboard?.pendingInvoices?.length) return null;
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pending Invoices</Text>
        {dashboard.pendingInvoices.map((inv) => (
          <Surface key={inv.id} style={styles.itemCard} elevation={1}>
            <TouchableOpacity style={styles.cardContent} onPress={() => navigation.navigate(ROUTES.BILLING)}>
              <View style={[styles.itemIconContainer, { backgroundColor: '#FFF9F0' }]}>
                <IconButton icon="file-clock-outline" iconColor="#FFB347" size={22} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{inv.invoiceNo}</Text>
                <Text style={styles.itemSub}>{inv.customer.name}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemAmount}>{formatCurrency(inv.amount)}</Text>
                <Text style={[styles.itemDate, { color: '#FFB347' }]}>Draft</Text>
              </View>
            </TouchableOpacity>
          </Surface>
        ))}
      </View>
    );
  };

  const renderRecentCustomers = () => {
    if (!dashboard?.recentActivities?.customers?.length) return null;
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Customers</Text>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {dashboard.recentActivities.customers.map((cust) => (
          <Surface key={cust.id} style={styles.itemCard} elevation={1}>
            <View style={styles.cardContent}>
              <Avatar.Text 
                size={40} 
                label={cust.name.substring(0,2).toUpperCase()} 
                style={{ backgroundColor: '#4FD3B5' }} 
                labelStyle={{ fontSize: 14 }}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{cust.name}</Text>
                <Text style={styles.itemSub}>{cust.email}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemDate}>{formatDate(cust.createdAt)}</Text>
              </View>
            </View>
          </Surface>
        ))}
      </View>
    );
  };

  return (
    <ScreenTemplate
      loading={loading}
      onRefresh={refetch}
      title={user?.name?.split(' ')[0] || 'Admin'}
      subtitle="Good morning,"
      headerAction={<IconButton icon="bell-outline" iconColor="#333" />}
      headerContent={
        <>
          <View style={styles.profileRow}>
            <Text style={styles.roleText}>{role?.name || 'Super Admin'}</Text>
            <Avatar.Text size={50} label="NU" style={{ backgroundColor: '#FF4B7D' }} labelStyle={{ color: '#fff' }} />
          </View>
          <Surface style={styles.statsBar} elevation={4}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Revenue</Text>
              <Text style={styles.statValue}>₹{dashboard?.stats?.revenue?.total || 0}</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Orders</Text>
              <Text style={styles.statValue}>{dashboard?.stats?.orders?.total || 0}</Text>
            </View>
          </Surface>
        </>
      }
      footer={
        <Surface style={styles.bottomNav} elevation={4}>
          <IconButton icon="home" iconColor="#4FD3B5" />
          <IconButton icon="account-group-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)} />
          <IconButton icon="briefcase-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.BILLING)} />
        </Surface>
      }
    >
      {renderInventoryStatus()}
      {renderPendingInvoices()}
      {renderRecentCustomers()}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -10 },
  roleText: { fontSize: 13, color: '#333', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '600' },
  statsBar: { backgroundColor: '#fff', marginTop: 30, borderRadius: 20, height: 85, flexDirection: 'row', alignItems: 'center', zIndex: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  verticalDivider: { width: 1, height: '40%', backgroundColor: '#EEE' },
  sectionContainer: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  viewAllText: { color: '#4FD3B5', fontWeight: '700', fontSize: 13 },
  inventoryGrid: { flexDirection: 'row', gap: 15 },
  invBox: { flex: 1, paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  invValue: { fontSize: 22, fontWeight: 'bold' },
  invLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  itemCard: { borderRadius: 18, backgroundColor: '#fff', marginBottom: 10, borderWidth: 1, borderColor: '#F8F8F8' },
  cardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  itemIconContainer: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  itemSub: { fontSize: 11, color: '#999', marginTop: 2 },
  itemRight: { alignItems: 'flex-end' },
  itemAmount: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  itemDate: { fontSize: 10, color: '#BBB', marginTop: 2 },
  bottomNav: { marginHorizontal: 25, marginBottom: 25, height: 65, borderRadius: 22, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }
});

export default DashboardScreen;