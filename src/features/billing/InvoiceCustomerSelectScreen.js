import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { IconButton, Surface, Avatar } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useCustomers } from '@hooks';
import { EmptyState, PaginationControls, LoadingScreen } from '@components';

const InvoiceCustomerSelectScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    customers = [], 
    loading = false, 
    pagination = {}, 
    fetchCustomers = () => {} 
  } = useCustomers();

  const loadCustomers = useCallback(() => {
    fetchCustomers({
      page: currentPage,
      limit: 20,
      search: searchQuery || undefined,
      isActive: true,
      sortField: 'name',
      sortDirection: 'asc',
    });
  }, [currentPage, searchQuery, fetchCustomers]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const renderCustomerCard = ({ item }) => (
    <Surface style={styles.card} elevation={1}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => navigation.navigate(ROUTES.INVOICE_PRODUCT_SELECT, { customer: item })}
      >
        <Avatar.Text 
          size={44} 
          label={item.name.substring(0, 2).toUpperCase()} 
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.companyName}>{item.companyName || 'Private Customer'}</Text>
          {!!item.email && <Text style={styles.userEmail}>{item.email}</Text>}
        </View>

        <View style={styles.selectCircle}>
           <IconButton icon="chevron-right" size={20} iconColor="#CCC" />
        </View>
      </TouchableOpacity>
    </Surface>
  );

  return (
    <View style={styles.container}>
      {/* 1. BRANDED HEADER WITH PROGRESS */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 1 of 4</Text>
          </View>
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={styles.subTitle}>Create New Invoice</Text>
          <Text style={styles.mainTitle}>Select Customer</Text>
        </View>

        {/* 2. FLOATING SEARCH BAR */}
        <Surface style={styles.searchContainer} elevation={2}>
          <TextInput
            placeholder="Search customers..."
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.input}
          />
          <IconButton icon="magnify" iconColor="#4FD3B5" size={24} />
        </Surface>
      </View>

      {/* 3. LIST CONTENT AREA */}
      <View style={styles.contentSheet}>
        {loading && customers.length === 0 ? (
          <LoadingScreen fullScreen={false} />
        ) : customers.length === 0 ? (
          <EmptyState
            icon="account-search"
            title="No customers found"
            message="Please try a different search term"
          />
        ) : (
          <FlatList
            data={customers}
            renderItem={renderCustomerCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  headerBackground: {
    backgroundColor: '#61F2D5',
    height: 250,
    paddingTop: 45,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 10 
  },
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 20,
  },
  stepText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
  },
  headerTextGroup: { 
    paddingHorizontal: 25, 
    marginTop: 5 
  },
  subTitle: { 
    fontSize: 13, 
    color: '#444', 
    opacity: 0.7 
  },
  mainTitle: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#222', 
    fontFamily: 'serif' 
  },
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
  input: { 
    flex: 1, 
    fontSize: 15, 
    color: '#333' 
  },
  contentSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 5,
  },
  listPadding: { 
    paddingHorizontal: 25, 
    paddingTop: 60, 
    paddingBottom: 40 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDFDFD',
  },
  cardContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12 
  },
  avatar: { 
    backgroundColor: '#F0FFFC' 
  },
  avatarLabel: { 
    color: '#4FD3B5', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  textContainer: { 
    flex: 1, 
    marginLeft: 15 
  },
  userName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  companyName: { 
    fontSize: 11, 
    color: '#FF4B7D', // Brand accent for secondary info
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2
  },
  userEmail: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 2 
  },
  selectCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default InvoiceCustomerSelectScreen;