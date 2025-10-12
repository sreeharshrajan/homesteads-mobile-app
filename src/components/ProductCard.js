import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Text } from 'react-native-paper';
import { formatCurrency } from '../utils/formatters';

/**
 * ProductCard Component
 * Product selection card with variants
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
  const variant = selectedVariant || product.variants?.[0];
  const price = variant?.offerPrice || variant?.price || product.basePrice || 0;
  const mrp = variant?.mrp;
  const hasDiscount = mrp && price < mrp;

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        <View style={styles.row}>
          {product.defaultImage && (
            <Image
              source={{ uri: product.defaultImage }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.info}>
            <Title style={styles.title} numberOfLines={2}>
              {product.name}
            </Title>
            
            {variant && (
              <Paragraph style={styles.variant}>{variant.name}</Paragraph>
            )}
            
            <View style={styles.priceRow}>
              <Title style={styles.price}>{formatCurrency(price)}</Title>
              {hasDiscount && (
                <Text style={styles.mrp}>{formatCurrency(mrp)}</Text>
              )}
            </View>
            
            {hasDiscount && (
              <Text style={styles.discount}>
                {Math.round(((mrp - price) / mrp) * 100)}% OFF
              </Text>
            )}
          </View>
        </View>

        {product.variants && product.variants.length > 1 && (
          <View style={styles.variantsRow}>
            {product.variants.map((v) => (
              <Button
                key={v.id}
                mode={v.id === variant?.id ? 'contained' : 'outlined'}
                compact
                onPress={() => onVariantSelect(v)}
                style={styles.variantButton}
              >
                {v.name}
              </Button>
            ))}
          </View>
        )}

        {quantity > 0 ? (
          <View style={styles.quantityRow}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => onQuantityChange(Math.max(0, quantity - 1))}
            />
            <Text style={styles.quantityText}>{quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => onQuantityChange(quantity + 1)}
            />
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={() => onAddToCart()}
            style={styles.addButton}
          >
            Add to Cart
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  variant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  mrp: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  variantsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  variantButton: {
    marginRight: 4,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 8,
  },
});

export default ProductCard;

