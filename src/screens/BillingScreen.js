import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { Card, Title, Paragraph, FAB, Appbar } from 'react-native-paper';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ROUTES } from '../utils/constants';
import { useInvoices } from '../hooks';
import { FilterBar, PaginationControls, StatusBadge, EmptyState } from '../components';

const BillingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { invoices, loading, pagination, fetchInvoices } = useInvoices();

  const loadInvoices = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
    };
    fetchInvoices(params);
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
  };

  const handleRefresh = () => {
    loadInvoices();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderInvoiceCard = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.INVOICE, { invoiceId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.invoiceNo || 'N/A'}</Title>
          {item.status && <StatusBadge status={item.status} style={styles.statusBadge} />}
        </View>
        
        {item.customer && (
          <Paragraph style={styles.customerName}>{item.customer.name}</Paragraph>
        )}
        
        <View style={styles.cardRow}>
          <Paragraph style={styles.label}>Amount:</Paragraph>
          <Title style={styles.amount}>{formatCurrency(item.totalAmount || 0)}</Title>
        </View>
        
        {item.issueDate && (
          <View style={styles.cardRow}>
            <Paragraph style={styles.label}>Issue Date:</Paragraph>
            <Paragraph>{formatDate(item.issueDate)}</Paragraph>
          </View>
        )}
        
        {item.dueDate && (
          <View style={styles.cardRow}>
            <Paragraph style={styles.label}>Due Date:</Paragraph>
            <Paragraph>{formatDate(item.dueDate)}</Paragraph>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Billing & Invoices" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearch}
          statusFilter={statusFilter}
          statusOptions={[
            { value: 'DRAFT', label: 'Draft' },
            { value: 'SENT', label: 'Sent' },
            { value: 'PAID', label: 'Paid' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          onStatusChange={handleStatusChange}
        />

        {invoices.length === 0 && !loading ? (
          <EmptyState
            icon="file-document-outline"
            title="No invoices found"
            message={searchQuery ? "Try adjusting your search" : "Create your first invoice to get started"}
          />
        ) : (
          <FlatList
            data={invoices}
            renderItem={renderInvoiceCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
          />
        )}

        {pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </View>

      <FAB
        icon="plus"
        label="New Invoice"
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.INVOICE_CUSTOMER_SELECT)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 4,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
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
  statusBadge: {
    height: 28,
  },
  customerName: {
    color: '#666',
    fontSize: 14,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default BillingScreen;
