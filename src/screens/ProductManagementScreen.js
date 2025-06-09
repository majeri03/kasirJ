import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, List, Divider, Searchbar, Text, IconButton, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useProductStore } from '../store/useProductStore';
import Papa from 'papaparse';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


const ProductManagementScreen = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { products, fetchProducts, deleteProduct, addProduct } = useProductStore();

  useFocusEffect(
    useCallback(() => {
      fetchProducts(searchQuery);
    }, [searchQuery])
  );
  
  const handleDelete = (id, name) => {
    Alert.alert(
      "Hapus Produk",
      `Apakah Anda yakin ingin menghapus "${name}"?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", onPress: () => deleteProduct(id), style: "destructive" },
      ]
    );
  };

  const handleImportCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
      });
      
      if (result.canceled) return;

      const fileUri = result.assets[0].uri;
      const csvString = await FileSystem.readAsStringAsync(fileUri);
      
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          let importedCount = 0;
          for (const row of results.data) {
            // Validate row has required columns
            if (row.name && row.price && row.stock && row.code) {
              await addProduct({
                name: row.name,
                price: parseFloat(row.price),
                stock: parseInt(row.stock),
                code: row.code.toString()
              });
              importedCount++;
            }
          }
          Alert.alert("Sukses", `${importedCount} produk berhasil diimpor.`);
          fetchProducts();
        },
        error: (error) => {
          Alert.alert("Gagal Impor", `Terjadi kesalahan saat mem-parsing CSV: ${error.message}`);
        }
      });
    } catch (err) {
      console.error("Error importing CSV:", err);
      Alert.alert("Gagal", "Tidak dapat membuka atau membaca file.");
    }
  };


  const renderItem = ({ item }) => (
    <List.Item
      title={item.name}
      description={`Harga: Rp${item.price.toLocaleString('id-ID')} | Stok: ${item.stock} | Kode: ${item.code}`}
      left={props => <List.Icon {...props} icon="cube-outline" />}
      right={() => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="pencil" onPress={() => navigation.navigate('AddEditProduct', { product: item })} />
          <IconButton icon="delete" iconColor={theme.colors.error} onPress={() => handleDelete(item.id, item.name)} />
        </View>
      )}
    />
  );
};