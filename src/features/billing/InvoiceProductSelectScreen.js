import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { IconButton, Surface, Badge } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useProducts } from '@hooks';
import { ProductCard, EmptyState, PaginationControls, LoadingScreen } from '@components';

const InvoiceProductSelectScreen = ({ navigation, route }) => {
  const { customer } = route.params;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  const { products = [], loading, pagination = {}, fetchProducts, searchProducts } = useProducts();

  const loadProducts = useCallback(() => {
    const params = {
      page: currentPage,
      limit: 10,
      isActive: true,
      includeVariants: true,
      includeMedia: true,
      includePricing: true,
      includeDiscounts: true,
    };

    if (searchQuery) {
      searchProducts({ ...params, q: searchQuery });
    } else {
      fetchProducts(params);
    }
  }, [currentPage, searchQuery, fetchProducts, searchProducts]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
  };

  const handleAddToCart = (product) => {
    const variant = selectedVariants[product.id] || product.variants?.[0];
    if (!variant) return;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.variantId === variant.id);
      const price = variant.offerPrice || variant.price || product.basePrice;
      const taxRate = product.taxGroup?.taxes?.reduce((sum, t) => sum + t.rate, 0) || 0;
      const unitTax = parseFloat((price * (taxRate / 100)).toFixed(2));

      if (existingIndex >= 0) {
        const newCart = [...prevCart];
        const newQty = newCart[existingIndex].quantity + 1;
        newCart[existingIndex].quantity = newQty;
        newCart[existingIndex].taxAmount = unitTax * newQty;
        newCart[existingIndex].totalPrice = price * newQty;
        return newCart;
      }

      return [...prevCart, {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        sku: variant.sku,
        quantity: 1,
        unitPrice: price,
        taxAmount: unitTax,
        totalPrice: price,
      }];
    });
  };

  const handleQuantityChange = (variantId, quantity) => {
    setCart(prevCart => {
      if (quantity <= 0) return prevCart.filter(item => item.variantId !== variantId);
      return prevCart.map(item => item.variantId === variantId
        ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
        : item
      );
    });
  };

  const getProductQuantity = useCallback((productId) => {
    const variant = selectedVariants[productId] || products?.find(p => p.id === productId)?.variants?.[0];
    if (!variant) return 0;
    return cart.find(i => i.variantId === variant.id)?.quantity || 0;
  }, [cart, selectedVariants, products]);

  const cartItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const renderProductCard = ({ item }) => {
    const selectedVariant = selectedVariants[item.id] || item.variants?.[0];
    const quantity = getProductQuantity(item.id);

    return (
      <View style={styles.cardWrapper}>
        <ProductCard
          product={item}
          selectedVariant={selectedVariant}
          quantity={quantity}
          onVariantSelect={(v) => handleVariantSelect(item.id, v)}
          onQuantityChange={(newQty) => handleQuantityChange(selectedVariant?.id || item.variants?.[0]?.id, newQty)}
          onAddToCart={() => handleAddToCart(item)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. BRANDED HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 2 of 4</Text>
          </View>
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={styles.subTitle}>{customer?.name || 'Create Invoice'}</Text>
          <Text style={styles.mainTitle}>Select Products</Text>
        </View>

        {/* 2. FLOATING SEARCH BAR WITH CART BADGE */}
        <Surface style={styles.searchContainer} elevation={2}>
          <TextInput
            placeholder="Search products or SKU..."
            placeholderTextColor="#AAA"
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.input}
          />
          <View style={styles.cartAnchor}>
            <IconButton icon="cart-outline" iconColor="#4FD3B5" size={24} />
            {cartItemsCount > 0 && (
              <Badge style={styles.cartBadge} size={16}>{cartItemsCount}</Badge>
            )}
          </View>
        </Surface>
      </View>

      {/* 3. CONTENT AREA */}
      <View style={styles.contentSheet}>
        {loading && products.length === 0 ? (
          <LoadingScreen fullScreen={false} />
        ) : products?.length === 0 ? (
          <EmptyState
            icon="package-variant-closed"
            title="No products found"
            message={searchQuery ? "Try a different search" : "Inventory is empty"}
          />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
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

      {/* 4. PREMIUM FLOATING FOOTER */}
      {cart.length > 0 && (
        <Surface style={styles.footerSheet} elevation={8}>
          <View style={styles.footerRow}>
            <View>
              <Text style={styles.footerLabel}>Subtotal</Text>
              <Text style={styles.footerPrice}>
                ₹{cart.reduce((sum, i) => sum + i.totalPrice, 0).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate(ROUTES.INVOICE_DISCOUNT, { customer, cart })}
            >
              <Text style={styles.checkoutText}>Review Items</Text>
              <IconButton icon="chevron-right" iconColor="#fff" size={20} />
            </TouchableOpacity>
          </View>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    backgroundColor: '#61F2D5',
    height: 240,
    paddingTop: 45,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 },
  stepIndicator: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 20 },
  stepText: { fontSize: 11, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  headerTextGroup: { paddingHorizontal: 25, marginTop: 5 },
  subTitle: { fontSize: 13, color: '#444', opacity: 0.7 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#222', fontFamily: 'serif' },
  
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
  input: { flex: 1, fontSize: 14, color: '#333' },
  cartAnchor: { position: 'relative' },
  cartBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: '#FF4B7D' },

  contentSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 5,
  },
  listPadding: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120 },
  cardWrapper: { marginBottom: 15 },

  footerSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 35,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase' },
  footerPrice: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  checkoutBtn: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 8,
    height: 50,
    borderRadius: 18,
  },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});

export default InvoiceProductSelectScreen;