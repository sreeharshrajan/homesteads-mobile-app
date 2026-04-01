import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity, Text } from 'react-native';
import { IconButton, Surface, Divider, Menu } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useOrders } from '@hooks';
import { PaginationControls, OrderCard, EmptyState } from '@components';

const OrderListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  
  const { orders = [], loading, pagination, fetchOrders } = useOrders();

  const loadOrders = useCallback(() => {
    // Wiring up the functional fetch with current state
    const params = {
      page: currentPage,
      limit: 20,
      status: statusFilter || undefined,
      search: searchQuery || undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
      includeCustomer: true,
    };
    
    fetchOrders(params);
  }, [currentPage, statusFilter, searchQuery, fetchOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setVisible(false);
  };

  const renderOrderCard = ({ item }) => (
    <View style={styles.cardWrapper}>
       <OrderCard order={item} onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 1. PREMIUM BRANDED HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <IconButton icon="menu" iconColor="#333" onPress={() => navigation.openDrawer()} />
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={styles.subTitle}>Track Shipments</Text>
          <Text style={styles.mainTitle}>Orders</Text>
        </View>

        {/* 2. FLOATING SEARCH & STATUS FILTER */}
        <Surface style={styles.searchContainer} elevation={2}>
          <TextInput
            placeholder="Search order number..."
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.input}
          />
          <Divider style={styles.verticalDivider} />
          
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <IconButton 
                icon={statusFilter ? "filter" : "filter-variant"} 
                size={22} 
                iconColor={statusFilter ? "#FF4B7D" : "#4FD3B5"} 
                onPress={() => setVisible(true)} 
              />
            }
          >
            <Menu.Item onPress={() => handleStatusChange(null)} title="All Orders" />
            <Menu.Item onPress={() => handleStatusChange('PENDING')} title="Pending" />
            <Menu.Item onPress={() => handleStatusChange('CONFIRMED')} title="Confirmed" />
            <Menu.Item onPress={() => handleStatusChange('SHIPPED')} title="Shipped" />
            <Menu.Item onPress={() => handleStatusChange('DELIVERED')} title="Delivered" />
          </Menu>
        </Surface>
      </View>

      {/* 3. CONTENT SHEET */}
      <View style={styles.contentSheet}>
        {orders.length === 0 && !loading ? (
          <EmptyState icon="cart-outline" title="No orders found" message="Try adjusting your status filters" />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadOrders} tintColor="#4FD3B5" />}
            ListFooterComponent={
              pagination?.totalPages > 1 && (
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                  loading={loading}
                />
              )
            }
          />
        )}
      </View>

      {/* 4. UNIFIED BOTTOM NAV */}
      <Surface style={styles.bottomNav} elevation={4}>
        <IconButton icon="home-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} />
        <IconButton icon="account-group-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)} />
        <View style={styles.activeTabContainer}>
          <IconButton icon="package-variant" iconColor="#4FD3B5" />
          <View style={styles.activeDot} />
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    backgroundColor: '#61F2D5',
    height: 260,
    paddingTop: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  headerTextGroup: { paddingHorizontal: 25, marginTop: 5 },
  subTitle: { fontSize: 13, color: '#444', opacity: 0.7 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#222', fontFamily: 'serif' },
  
  searchContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 20,
    borderRadius: 15,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 5,
    zIndex: 20,
  },
  input: { flex: 1, fontSize: 15, color: '#333' },
  verticalDivider: { width: 1, height: '50%', backgroundColor: '#EEE', marginHorizontal: 5 },
  
  contentSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 5,
  },
  listPadding: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120 },
  cardWrapper: { marginBottom: 5 },

  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100
  },
  activeTabContainer: { alignItems: 'center' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4FD3B5', marginTop: -8 }
});

export default OrderListScreen;