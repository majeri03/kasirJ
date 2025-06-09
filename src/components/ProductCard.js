import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';

const ProductCard = ({ product, onAddToCart }) => {
  const theme = useTheme();
  const stockColor = product.stock > 10 ? theme.colors.primary : theme.colors.error;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.productName}>{product.name}</Text>
        <Text variant="bodyLarge" style={styles.productPrice}>
          Rp{product.price.toLocaleString('id-ID')}
        </Text>
        <Text variant="bodySmall" style={{ color: stockColor }}>
          Stok: {product.stock}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock > 0 ? 'Tambah' : 'Stok Habis'}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    marginBottom: 8,
  },
});

export default ProductCard;