import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { Card, Title, Paragraph, FAB, Appbar, Searchbar, Chip } from 'react-native-paper';
import { ROUTES } from '../utils/constants';
import { formatPhoneNumber } from '../utils/formatters';
import useAuthStore from '../store/authStore';

// Sample data for demonstration
const SAMPLE_CUSTOMERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
    address: '123 Main St, City, State 12345',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '5559876543',
    address: '456 Oak Ave, City, State 12345',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '5555551234',
    address: '789 Pine Rd, City, State 12345',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    phone: '5554443333',
    address: '321 Elm St, City, State 12345',
    status: 'active',
  },
];

const CustomerListScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS);
  const [filteredCustomers, setFilteredCustomers] = useState(SAMPLE_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, you would fetch data from API here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace(ROUTES.LOGIN);
  };

  const renderCustomerCard = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.CUSTOMER_FORM, { customerId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.name}</Title>
          <Chip
            mode="outlined"
            style={[
              styles.statusChip,
              item.status === 'active' ? styles.activeChip : styles.inactiveChip,
            ]}
          >
            {item.status}
          </Chip>
        </View>
        <Paragraph style={styles.email}>{item.email}</Paragraph>
        <Paragraph style={styles.phone}>{formatPhoneNumber(item.phone)}</Paragraph>
        <Paragraph style={styles.address}>{item.address}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.Content title="Customers" />
        <Appbar.Action icon="invoice-text-outline" onPress={() => navigation.navigate(ROUTES.BILLING)} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />

        <FlatList
          data={filteredCustomers}
          renderItem={renderCustomerCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.CUSTOMER_FORM)}
      />
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
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingTop: 8,
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
  statusChip: {
    height: 28,
  },
  activeChip: {
    backgroundColor: '#e8f5e9',
  },
  inactiveChip: {
    backgroundColor: '#ffebee',
  },
  email: {
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    color: '#666',
    marginBottom: 4,
  },
  address: {
    color: '#888',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CustomerListScreen;

