import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { Card, Title, Paragraph, Chip, Appbar, FAB } from 'react-native-paper';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ROUTES } from '../utils/constants';

// Sample billing data
const SAMPLE_BILLING = [
  {
    id: '1',
    customerName: 'John Doe',
    amount: 1250.00,
    status: 'paid',
    dueDate: '2025-09-15',
    invoiceNumber: 'INV-001',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    amount: 890.50,
    status: 'pending',
    dueDate: '2025-10-01',
    invoiceNumber: 'INV-002',
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    amount: 2100.00,
    status: 'overdue',
    dueDate: '2025-09-01',
    invoiceNumber: 'INV-003',
  },
  {
    id: '4',
    customerName: 'Alice Williams',
    amount: 675.25,
    status: 'paid',
    dueDate: '2025-09-20',
    invoiceNumber: 'INV-004',
  },
];

const BillingScreen = ({ navigation }) => {
  const [billingData, setBillingData] = useState(SAMPLE_BILLING);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'overdue':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const renderBillingCard = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.INVOICE, { invoiceId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.customerName}</Title>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
            textStyle={styles.chipText}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>
        <Paragraph style={styles.invoiceNumber}>{item.invoiceNumber}</Paragraph>
        <View style={styles.cardRow}>
          <Paragraph style={styles.label}>Amount:</Paragraph>
          <Title style={styles.amount}>{formatCurrency(item.amount)}</Title>
        </View>
        <View style={styles.cardRow}>
          <Paragraph style={styles.label}>Due Date:</Paragraph>
          <Paragraph>{formatDate(item.dueDate)}</Paragraph>
        </View>
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
        <Appbar.Content title="Billing" />
      </Appbar.Header>

      <FlatList
        data={billingData}
        renderItem={renderBillingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <FAB
        icon="plus"
        label="New Invoice"
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.INVOICE)}
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
  statusChip: {
    height: 28,
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  invoiceNumber: {
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

