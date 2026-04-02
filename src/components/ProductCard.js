import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import {
  Card,
  Text,
  Button,
  IconButton,
  useTheme,
  Surface,
  TouchableRipple,
} from 'react-native-paper';
import { formatCurrency } from '@utils/formatters';

/**
 * ProductCard Component
 * Refactored for performance, theming, and MD3 standards.
 */
const ProductCard = ({
  product,
  selectedVariant,
  quantity = 0,
  onVariantSelect,
  onQuantityChange,
  onAddToCart,
  style,
}) => {
  const theme = useTheme();

  // Logic calculation memoized to prevent re-calc on every render
  const { currentVariant, price, mrp, hasDiscount, discountPercentage } = useMemo(() => {
    const variant = selectedVariant || product.variants?.[0];
    const priceValue = variant?.offerPrice || variant?.price || product.basePrice || 0;
    const mrpValue = variant?.mrp;
    const discounted = mrpValue && priceValue < mrpValue;

    return {
      currentVariant: variant,
      price: priceValue,
      mrp: mrpValue,
      hasDiscount: discounted,
      discountPercentage: discounted ? Math.round(((mrpValue - priceValue) / mrpValue) * 100) : 0,
    };
  }, [product, selectedVariant]);

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }, style]} mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          {/* Image with placeholder background */}
          <Surface
            style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}
            elevation={0}
          >
            {product.defaultImage ? (
              <Image
                source={{ uri: product.defaultImage }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <IconButton icon="image-off-outline" size={24} style={styles.placeholderIcon} />
            )}
          </Surface>

          <View style={styles.info}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
              {product.name}
            </Text>

            {currentVariant && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {currentVariant.name}
              </Text>
            )}

            <View style={styles.priceContainer}>
              <Text variant="titleLarge" style={[styles.price, { color: theme.colors.primary }]}>
                {formatCurrency(price)}
              </Text>
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.mrpText}>{formatCurrency(mrp)}</Text>
                  <Text
                    variant="labelSmall"
                    style={[styles.discountText, { color: theme.colors.error }]}
                  >
                    {discountPercentage}% OFF
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Variant Selection Chips */}
        {product.variants?.length > 1 && (
          <View style={styles.variantsWrapper}>
            <Text variant="labelSmall" style={styles.sectionLabel}>
              Select Variant
            </Text>
            <View style={styles.variantsRow}>
              {product.variants.map((v) => (
                <TouchableRipple
                  key={v.id}
                  onPress={() => onVariantSelect(v)}
                  style={[
                    styles.variantChip,
                    {
                      borderColor:
                        v.id === currentVariant?.id
                          ? theme.colors.primary
                          : theme.colors.outlineVariant,
                      backgroundColor:
                        v.id === currentVariant?.id ? theme.colors.primaryContainer : 'transparent',
                    },
                  ]}
                >
                  <Text
                    variant="labelMedium"
                    style={{
                      color:
                        v.id === currentVariant?.id
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                    }}
                  >
                    {v.name}
                  </Text>
                </TouchableRipple>
              ))}
            </View>
          </View>
        )}

        {/* Action Area */}
        <View style={styles.actionArea}>
          {quantity > 0 ? (
            <Surface
              style={[
                styles.quantitySelector,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
              elevation={0}
            >
              <IconButton
                icon="minus"
                size={18}
                iconColor={theme.colors.onSecondaryContainer}
                onPress={() => onQuantityChange(Math.max(0, quantity - 1))}
              />
              <Text variant="titleMedium" style={{ color: theme.colors.onSecondaryContainer }}>
                {quantity}
              </Text>
              <IconButton
                icon="plus"
                size={18}
                iconColor={theme.colors.onSecondaryContainer}
                onPress={() => onQuantityChange(quantity + 1)}
              />
            </Surface>
          ) : (
            <Button
              mode="contained"
              icon="cart-plus"
              onPress={onAddToCart}
              style={styles.addButton}
              contentStyle={styles.addButtonContent}
            >
              Add to Cart
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  content: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
    gap: 8,
  },
  price: {
    fontWeight: '800',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mrpText: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  discountText: {
    fontWeight: '700',
  },
  variantsWrapper: {
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 6,
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  variantsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  variantChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionArea: {
    marginTop: 4,
  },
  addButton: {
    borderRadius: 8,
  },
  addButtonContent: {
    height: 44,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 4,
  },
});

export default React.memo(ProductCard);
