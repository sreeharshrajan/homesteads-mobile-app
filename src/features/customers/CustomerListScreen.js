import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity, Text } from 'react-native';
import { IconButton, Surface, Avatar, Divider, Menu } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useCustomers } from '@hooks';
import { PaginationControls, EmptyState } from '@components';

const CustomerListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);

  const { customers, loading, pagination, fetchCustomers } = useCustomers();

  const loadCustomers = useCallback(() => {
    fetchCustomers({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
    });
  }, [currentPage, searchQuery, statusFilter, fetchCustomers]);

  useEffect(() => { loadCustomers(); }, [loadCustomers]);

  const handleSearch = (query) => { setSearchQuery(query); setCurrentPage(1); };
  const handleStatusChange = (status) => { setStatusFilter(status); setCurrentPage(1); setVisible(false); };

  const renderCustomerCard = ({ item }) => (
    <Surface style={styles.card} elevation={1}>
      <View style={styles.cardRow}>
        <Avatar.Image size={44} source={{ uri: `https://ui-avatars.com/api/?name=${item.name}&background=random` }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userRole}>{item.companyName || 'Sales Associate'}</Text>
          <View style={styles.countsRow}>
            <Text style={styles.countText}>Orders: {item._count?.orders || 0}</Text>
            <View style={styles.dotSeparator} />
            <Text style={styles.countText}>Invoices: {item._count?.invoices || 0}</Text>
          </View>
        </View>
        <View style={styles.actionColumn}>
          <TouchableOpacity style={[styles.statusCircle, item.isActive && styles.statusCircleActive]}>
            {item.isActive && <View style={styles.innerCheck} />}
          </TouchableOpacity>
          <View style={styles.iconActions}>
            <IconButton icon="eye-outline" size={18} onPress={() => navigation.navigate(ROUTES.CUSTOMER_DETAILS, { customerId: item.id })} />
            <IconButton icon="pencil-outline" size={18} onPress={() => navigation.navigate(ROUTES.CUSTOMER_FORM, { customerId: item.id })} />
          </View>
        </View>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <IconButton icon="menu" iconColor="#333" onPress={() => navigation.openDrawer()} />
        </View>
        <View style={styles.headerTextGroup}>
          <Text style={styles.subTitle}>Manage</Text>
          <Text style={styles.mainTitle}>Customers</Text>
        </View>
        <Surface style={styles.searchContainer} elevation={2}>
          <TextInput placeholder="Search for member..." placeholderTextColor="#AAA" value={searchQuery} onChangeText={handleSearch} style={styles.input} />
          <Divider style={styles.verticalDivider} />
          <Menu visible={visible} onDismiss={() => setVisible(false)} anchor={<IconButton icon={statusFilter ? "filter" : "filter-variant"} size={22} iconColor={statusFilter ? "#FF4B7D" : "#4FD3B5"} onPress={() => setVisible(true)} />}>
            <Menu.Item onPress={() => handleStatusChange(null)} title="All Status" />
            <Menu.Item onPress={() => handleStatusChange('active')} title="Active Only" />
            <Menu.Item onPress={() => handleStatusChange('inactive')} title="Inactive Only" />
          </Menu>
        </Surface>
      </View>
      
      <View style={styles.contentSheet}>
        {customers.length === 0 && !loading ? (
          <EmptyState icon="account-search" title="No customers found" />
        ) : (
          <FlatList
            data={customers}
            renderItem={renderCustomerCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCustomers} />}
            ListFooterComponent={pagination.totalPages > 1 && <PaginationControls currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => setCurrentPage(page)} loading={loading} />}
          />
        )}
      </View>

      {/* CREATE CUSTOMER BUTTON */}
      <TouchableOpacity 
        style={styles.floatingFab} 
        onPress={() => navigation.navigate(ROUTES.CUSTOMER_FORM)}
        activeOpacity={0.8}
      >
        <IconButton icon="plus" iconColor="#fff" size={28} />
      </TouchableOpacity>

      <Surface style={styles.bottomNav} elevation={4}>
        <IconButton icon="home-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} />
        <View style={styles.activeTabContainer}>
          <IconButton icon="account-group" iconColor="#4FD3B5" />
          <View style={styles.activeDot} />
        </View>
        <IconButton icon="briefcase-outline" iconColor="#CCC" />
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: { backgroundColor: '#61F2D5', height: 260, paddingTop: 40, borderBottomLeftRadius: 60, borderBottomRightRadius: 60, zIndex: 1 },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  headerTextGroup: { paddingHorizontal: 25, marginTop: 5 },
  subTitle: { fontSize: 13, color: '#444', opacity: 0.7 },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#222', fontFamily: 'serif' },
  searchContainer: { backgroundColor: '#fff', marginHorizontal: 25, marginTop: 20, borderRadius: 15, height: 50, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 5, zIndex: 10 },
  input: { flex: 1, fontSize: 15, color: '#333' },
  verticalDivider: { width: 1, height: '50%', backgroundColor: '#EEE', marginHorizontal: 5 },
  contentSheet: { flex: 1, marginTop: -40, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, zIndex: 2 },
  listPadding: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 130 },
  card: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 12, padding: 12, borderWidth: 1, borderColor: '#FDFDFD' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#F0F0F0' },
  textContainer: { flex: 1, marginLeft: 12 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  userRole: { fontSize: 12, color: '#888' },
  countsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  countText: { fontSize: 11, color: '#4FD3B5', fontWeight: '700' },
  dotSeparator: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#EEE', marginHorizontal: 6 },
  actionColumn: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 60 },
  statusCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  statusCircleActive: { borderColor: '#FF4B7D' },
  innerCheck: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4B7D' },
  iconActions: { flexDirection: 'row', marginRight: -8, marginBottom: -8 },
  floatingFab: {
    position: 'absolute',
    bottom: 100, // Positioned above the bottom nav
    right: 25,
    backgroundColor: '#FF4B7D', // Accent pink from design
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 100,
  },
  bottomNav: { position: 'absolute', bottom: 25, left: 25, right: 25, height: 65, borderRadius: 22, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', zIndex: 50 },
  activeTabContainer: { alignItems: 'center' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4FD3B5', marginTop: -8 }
});

export default CustomerListScreen;