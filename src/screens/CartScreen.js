import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { List, Text, Button, Divider, IconButton, useTheme } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useCartStore } from '../store/useCartStore';
import { createTransaction } from '../services/transactionService';
import { getReceiptHtml } from '../components/ReceiptHTML';

const CartScreen = ({ navigation }) => {
  const theme = useTheme();
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCartStore();
  const totalAmount = getTotal();

  const handleCheckout = async () => {
    const result = await createTransaction(items, totalAmount);
    if (result.success) {
      Alert.alert(
        "Transaksi Berhasil",
        "Stok produk telah diperbarui.",
        [
          { text: "Cetak Struk", onPress: () => printReceipt() },
          { text: "OK", onPress: () => {
              clearCart();
              navigation.navigate('Home');
            } 
          },
        ]
      );
    } else {
      Alert.alert("Transaksi Gagal", "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const printReceipt = async () => {
    const html = getReceiptHtml(items, totalAmount);
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Bagikan struk' });
        clearCart();
        navigation.navigate('Home');
      }
    } catch (error) {
        console.error("Gagal mencetak struk:", error);
        Alert.alert("Gagal", "Tidak dapat mencetak atau membagikan struk.");
        clearCart();
        navigation.navigate('Home');
    }
  };
};