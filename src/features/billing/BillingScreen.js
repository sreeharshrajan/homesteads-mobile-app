import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TextInput, TouchableOpacity, Text } from 'react-native';
import { IconButton, Surface, Avatar, Divider, Menu } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { formatCurrency, formatDate } from '@utils/formatters';
import { useInvoices } from '@hooks';
import { PaginationControls, EmptyState } from '@components';

const BillingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);

  const { invoices, loading, pagination, fetchInvoices } = useInvoices();

  const loadInvoices = useCallback(() => {
    fetchInvoices({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
    });
  }, [currentPage, searchQuery, statusFilter, fetchInvoices]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setVisible(false);
  };

  const renderInvoiceCard = ({ item }) => (
    <Surface style={styles.card} elevation={1}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => navigation.navigate(ROUTES.INVOICE, { invoiceId: item.id })}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceNo}>{item.invoiceNo || 'N/A'}</Text>
            <Text style={styles.customerName}>{item.customer?.name || 'Unknown Customer'}</Text>
          </View>

          {/* Status Dot/Indicator */}
          <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusLabel}>{item.status}</Text>
          </View>
        </View>

        <Divider style={styles.cardDivider} />

        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.dateLabel}>Due Date</Text>
            <Text style={styles.dateValue}>{item.dueDate ? formatDate(item.dueDate) : 'N/A'}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{item.totalAmount || 0}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return '#4FD3B5';
      case 'DRAFT': return '#FFB347';
      case 'CANCELLED': return '#FF4B7D';
      default: return '#CCC';
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. BRANDED HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <IconButton icon="menu" iconColor="#333" onPress={() => navigation.openDrawer()} />
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={styles.subTitle}>Manage Financials</Text>
          <Text style={styles.mainTitle}>Billing</Text>
        </View>

        {/* 2. SEARCH & FILTER MENU */}
        <Surface style={styles.searchContainer} elevation={2}>
          <TextInput
            placeholder="Search invoice number..."
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
            <Menu.Item onPress={() => handleStatusChange(null)} title="All Invoices" />
            <Menu.Item onPress={() => handleStatusChange('PAID')} title="Paid" />
            <Menu.Item onPress={() => handleStatusChange('DRAFT')} title="Draft" />
            <Menu.Item onPress={() => handleStatusChange('CANCELLED')} title="Cancelled" />
          </Menu>
        </Surface>
      </View>

      {/* 3. CONTENT AREA */}
      <View style={styles.contentSheet}>
        {invoices.length === 0 && !loading ? (
          <EmptyState icon="file-document-outline" title="No invoices found" />
        ) : (
          <FlatList
            data={invoices}
            renderItem={renderInvoiceCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={loadInvoices} />}
            ListFooterComponent={
              pagination.totalPages > 1 && (
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                  loading={loading}
                />
              )
            }
          />
        )}
      </View>

      {/* 4. FAB & NAVIGATION */}
      <TouchableOpacity
        style={styles.floatingFab}
        onPress={() => navigation.navigate(ROUTES.INVOICE_CUSTOMER_SELECT)}
      >
        <IconButton icon="plus" iconColor="#fff" size={28} />
      </TouchableOpacity>

      <Surface style={styles.bottomNav} elevation={4}>
        <IconButton icon="home-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.DASHBOARD)} />
        <IconButton icon="account-group-outline" iconColor="#CCC" onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)} />
        <View style={styles.activeTabContainer}>
          <IconButton icon="file-document" iconColor="#4FD3B5" />
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
    zIndex: 1,
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
  },
  input: { flex: 1, fontSize: 15, color: '#333' },
  verticalDivider: { width: 1, height: '50%', backgroundColor: '#EEE', marginHorizontal: 5 },

  contentSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 2,
  },
  listPadding: { paddingHorizontal: 25, paddingTop: 30, paddingBottom: 120 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    overflow: 'hidden'
  },
  cardContent: { padding: 16 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  invoiceNo: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  customerName: { fontSize: 13, color: '#888', marginTop: 2 },
  statusTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusLabel: { fontSize: 10, color: '#fff', fontWeight: 'bold' },

  cardDivider: { marginVertical: 12, backgroundColor: '#F0F0F0' },

  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateLabel: { fontSize: 10, color: '#BBB', textTransform: 'uppercase' },
  dateValue: { fontSize: 13, color: '#555', fontWeight: '600' },
  amountContainer: { alignItems: 'flex-end' },
  amountLabel: { fontSize: 10, color: '#BBB', textTransform: 'uppercase' },
  amountValue: { fontSize: 18, fontWeight: 'bold', color: '#4FD3B5' },

  floatingFab: {
    position: 'absolute',
    bottom: 100,
    right: 25,
    backgroundColor: '#FF4B7D',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
  },

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
  },
  activeTabContainer: { alignItems: 'center' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4FD3B5', marginTop: -8 }
});

export default BillingScreen;