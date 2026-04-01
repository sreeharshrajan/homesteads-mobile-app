import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Appbar, Button, Badge } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { useProducts } from '@hooks';
import { ProductCard, EmptyState, PaginationControls, FilterBar } from '@components';

const InvoiceProductSelectScreen = ({ navigation, route }) => {
  const { customer } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  
  const { products, loading, pagination, fetchProducts, searchProducts } = useProducts();

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleVariantSelect = (productId, variant) => {
    setSelectedVariants({
      ...selectedVariants,
      [productId]: variant,
    });
  };

  const handleAddToCart = (product) => {
    const variant = selectedVariants[product.id] || product.variants?.[0];
    if (!variant) return;

    const existingItemIndex = cart.findIndex(
      (item) => item.variantId === variant.id
    );

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      updatedCart[existingItemIndex].totalPrice =
        updatedCart[existingItemIndex].unitPrice * updatedCart[existingItemIndex].quantity;
      setCart(updatedCart);
    } else {
      const price = variant.offerPrice || variant.price || product.basePrice;
      const newItem = {
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        sku: variant.sku,
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        taxAmount: 0, // Will be calculated on backend
      };
      setCart([...cart, newItem]);
    }
  };

  const handleQuantityChange = (variantId, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter((item) => item.variantId !== variantId));
    } else {
      const updatedCart = cart.map((item) => {
        if (item.variantId === variantId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity,
          };
        }
        return item;
      });
      setCart(updatedCart);
    }
  };

  const getProductQuantity = (productId) => {
    const variant = selectedVariants[productId] || products.find(p => p.id === productId)?.variants?.[0];
    if (!variant) return 0;
    
    const item = cart.find((i) => i.variantId === variant.id);
    return item ? item.quantity : 0;
  };

  const handleContinue = () => {
    navigation.navigate(ROUTES.INVOICE_DISCOUNT, { customer, cart });
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderProductCard = ({ item }) => {
    const selectedVariant = selectedVariants[item.id] || item.variants?.[0];
    const quantity = getProductQuantity(item.id);

    return (
      <ProductCard
        product={item}
        selectedVariant={selectedVariant}
        quantity={quantity}
        onVariantSelect={(variant) => handleVariantSelect(item.id, variant)}
        onQuantityChange={(newQty) => {
          const variantToUse = selectedVariant || item.variants?.[0];
          if (variantToUse) {
            handleQuantityChange(variantToUse.id, newQty);
          }
        }}
        onAddToCart={() => handleAddToCart(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLogo}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title="Select Products" 
          subtitle={`Step 2 of 4 • ${customer.name}`}
          titleStyle={styles.headerTitle}
        />
        {cartItemsCount > 0 && (
          <View style={styles.cartBadgeContainer}>
            <Badge style={styles.cartBadge}>{cartItemsCount}</Badge>
          </View>
        )}
      </Appbar.Header>

      <View style={styles.content}>
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={handleSearch}
        />

        {products.length === 0 && !loading ? (
          <EmptyState
            icon="package-variant"
            title="No products found"
            message={searchQuery ? "Try adjusting your search" : "No products available"}
          />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
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

      {cart.length > 0 && (
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
          >
            Continue ({cartItemsCount} items)
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 4,
  },
  logo: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cartBadgeContainer: {
    marginRight: 16,
  },
  cartBadge: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    paddingVertical: 8,
    borderRadius: 4,
  },
});

export default InvoiceProductSelectScreen;

