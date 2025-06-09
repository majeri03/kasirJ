import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Button, Badge, FAB, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { products, fetchProducts, isLoading } = useProductStore((state) => ({
    products: state.products,
    fetchProducts: state.fetchProducts,
    isLoading: state.isLoading,
  }));
  
  const { items: cartItems, addToCart } = useCartStore((state) => ({
    items: state.items,
    addToCart: state.addToCart,
  }));

  useFocusEffect(
    useCallback(() => {
      fetchProducts(searchQuery);
    }, [searchQuery])
  );
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Cari produk..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <View style={styles.buttonContainer}>
          <Button icon="cog" mode="outlined" onPress={() => navigation.navigate('ProductManagement')}>
            Produk
          </Button>
          <Button icon="chart-bar" mode="outlined" onPress={() => navigation.navigate('Reports')}>
            Laporan
          </Button>
      </View>
      
      {isLoading ? (
        <Text style={styles.loadingText}>Memuat produk...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard product={item} onAddToCart={addToCart} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada produk ditemukan.</Text>}
        />
      )}

      <FAB
        icon="qrcode-scan"
        style={styles.scannerFab}
        onPress={() => navigation.navigate('Scanner')}
      />

      {cartItemCount > 0 && (
        <FAB
          icon="cart"
          label={`Lihat Keranjang (${cartItemCount})`}
          style={styles.cartFab}
          onPress={() => navigation.navigate('Cart')}
        />
      )}
    </View>
  );
};