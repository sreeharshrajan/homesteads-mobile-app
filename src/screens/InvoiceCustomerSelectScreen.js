import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Title, Paragraph, Appbar, Searchbar } from 'react-native-paper';
import { ROUTES } from '../utils/constants';
import { useCustomers } from '../hooks';
import { EmptyState, PaginationControls } from '../components';
import { formatPhoneNumber } from '../utils/formatters';

const InvoiceCustomerSelectScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { customers, loading, pagination, fetchCustomers } = useCustomers();

  const loadCustomers = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      isActive: true,
      sortField: 'name',
      sortDirection: 'asc',
    };
    fetchCustomers(params);
  }, [currentPage, searchQuery, fetchCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCustomerSelect = (customer) => {
    navigation.navigate(ROUTES.INVOICE_PRODUCT_SELECT, { customer });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderCustomerCard = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => handleCustomerSelect(item)}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        {item.email && <Paragraph style={styles.text}>{item.email}</Paragraph>}
        {item.phone && <Paragraph style={styles.text}>{formatPhoneNumber(item.phone)}</Paragraph>}
        {item.companyName && <Paragraph style={styles.company}>{item.companyName}</Paragraph>}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Select Customer" subtitle="Step 1 of 4" />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />

        {customers.length === 0 && !loading ? (
          <EmptyState
            icon="account-group"
            title="No customers found"
            message={searchQuery ? "Try adjusting your search" : "Create a customer first to create invoices"}
          />
        ) : (
          <FlatList
            data={customers}
            renderItem={renderCustomerCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
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
  content: {
    flex: 1,
  },
  searchbar: {
    margin: 16,
    elevation: 0,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  text: {
    color: '#666',
    marginTop: 4,
  },
  company: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
});

export default InvoiceCustomerSelectScreen;

