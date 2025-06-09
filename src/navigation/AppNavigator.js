import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductManagementScreen from '../screens/ProductManagementScreen';
import AddEditProductScreen from '../screens/AddEditProductScreen';
import CartScreen from '../screens/CartScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Kasir POS' }} 
      />
      <Stack.Screen 
        name="ProductManagement" 
        component={ProductManagementScreen} 
        options={{ title: 'Manajemen Produk' }} 
      />
      <Stack.Screen 
        name="AddEditProduct" 
        component={AddEditProductScreen} 
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'Keranjang' }} 
      />
       <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ title: 'Pindai Barcode', presentation: 'modal' }} 
      />
      <Stack.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{ title: 'Laporan Penjualan' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;