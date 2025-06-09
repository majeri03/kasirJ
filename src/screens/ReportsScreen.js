import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Text, Divider, ActivityIndicator, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getAllTransactions } from '../services/transactionService';

const ReportsScreen = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gunakan useFocusEffect untuk mengambil data setiap kali layar ini dibuka
  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        setIsLoading(true);
        try {
          const data = await getAllTransactions();
          setTransactions(data);
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
          // Anda bisa menambahkan state untuk menampilkan pesan error di UI
        } finally {
          setIsLoading(false);
        }
      };

      fetchTransactions();
    }, [])
  );

  const renderItem = ({ item }) => (
    <List.Item
      title={`Transaksi #${item.id} - Rp${item.totalAmount.toLocaleString('id-ID')}`}
      description={`Waktu: ${new Date(item.createdAt).toLocaleString('id-ID')}\nItem: ${item.items.replace(/;/g, ',')}`}
      descriptionNumberOfLines={10} // Agar deskripsi tidak terpotong
      left={props => <List.Icon {...props} icon="receipt" />}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Divider />}
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text>Belum ada transaksi.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportsScreen;