import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Appbar, Button, Badge, useTheme, Surface } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useProducts } from '@hooks';
import { ProductCard, EmptyState, PaginationControls, FilterBar, LoadingScreen } from '@components';

const InvoiceProductSelectScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { customer } = route.params;

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});

  const { products = [], loading, pagination = {}, fetchProducts, searchProducts } = useProducts();

  // Memoized Load Logic
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

  // Handlers
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

      // Calculate Tax if the product has tax information
      // Most Indian GST is calculated as: Price * (Rate / 100)
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
        taxAmount: unitTax, // Important for the final API call
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

  // Helper to sync Cart State with UI
  const getProductQuantity = useCallback((productId) => {
    const variant = selectedVariants[productId] || products?.find(p => p.id === productId)?.variants?.[0];
    if (!variant) return 0;
    return cart.find(i => i.variantId === variant.id)?.quantity || 0;
  }, [cart, selectedVariants, products]);

  const cartItemsCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Renderers
  const renderProductCard = ({ item }) => {
    const selectedVariant = selectedVariants[item.id] || item.variants?.[0];
    const quantity = getProductQuantity(item.id);

    return (
      <ProductCard
        product={item}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onVariantSelect={(v) => handleVariantSelect(item.id, v)}
        onQuantityChange={(newQty) => handleQuantityChange(selectedVariant?.id || item.variants?.[0]?.id, newQty)}
        onAddToCart={() => handleAddToCart(item)}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Select Products"
          subtitle={`Step 2 of 4 • ${customer?.name || 'Customer'}`}
        />
        <View style={styles.badgeAnchor}>
          <Appbar.Action icon="cart-outline" onPress={() => { }} />
          {cartItemsCount > 0 && (
            <Badge style={styles.badge} size={18}>{cartItemsCount}</Badge>
          )}
        </View>
      </Appbar.Header>

      <FilterBar
        searchValue={searchQuery}
        onSearchChange={handleSearch}
        placeholder="Search product name or SKU..."
      />

      <View style={styles.content}>
        {loading && products.length === 0 ? (
          <LoadingScreen fullScreen={false} />
        ) : products?.length === 0 ? (
          <EmptyState
            icon="package-variant-closed"
            title="No products found"
            message={searchQuery ? "Try a different search term" : "Your inventory is currently empty"}
          />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            initialNumToRender={6}
          />
        )}
      </View>

      {/* Footer Navigation */}
      {pagination?.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      )}

      {cart.length > 0 && (
        <Surface style={styles.footer} elevation={4}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate(ROUTES.INVOICE_DISCOUNT, { customer, cart })}
            style={styles.continueButton}
            contentStyle={styles.btnContent}
            icon="arrow-right"
            contentReverse
          >
            Review {cartItemsCount} {cartItemsCount === 1 ? 'Item' : 'Items'}
          </Button>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  list: {
    paddingBottom: 100, // Space for the floating footer
  },
  badgeAnchor: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32, // Safe area padding
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  continueButton: {
    borderRadius: 12,
  },
  btnContent: {
    height: 48,
  },
});

export default InvoiceProductSelectScreen;