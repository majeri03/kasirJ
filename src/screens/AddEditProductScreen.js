import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Appbar, useTheme } from 'react-native-paper';
import { useProductStore } from '../store/useProductStore';

const AddEditProductScreen = ({ navigation, route }) => {
  const theme = useTheme();
  // Cek apakah ada produk yang dilempar dari layar sebelumnya (untuk mode edit)
  const existingProduct = route.params?.product;

  const [name, setName] = useState(existingProduct?.name || '');
  const [price, setPrice] = useState(existingProduct?.price?.toString() || '');
  const [stock, setStock] = useState(existingProduct?.stock?.toString() || '');
  const [code, setCode] = useState(existingProduct?.code || '');

  const { addProduct, updateProduct } = useProductStore();

  const isEditing = !!existingProduct;

  useEffect(() => {
    // Set judul halaman berdasarkan mode (Tambah atau Edit)
    navigation.setOptions({
      title: isEditing ? `Edit ${existingProduct.name}` : 'Tambah Produk Baru',
    });
  }, [navigation, isEditing, existingProduct]);

  const handleSave = () => {
    const productData = {
      id: existingProduct?.id, // id akan undefined jika mode tambah
      name,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      code,
    };

    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nama Produk"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Harga"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Stok"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Kode Barcode"
        value={code}
        onChangeText={setCode}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Simpan
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default AddEditProductScreen;