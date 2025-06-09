import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useCartStore } from '../store/useCartStore';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const addScannedItemToCart = useCartStore((state) => state.addScannedItemToCart);

  // 1. Meminta izin akses kamera saat komponen dimuat
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  // 2. Fungsi yang dijalankan ketika barcode berhasil terdeteksi
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true); // Tandai sebagai sudah dipindai untuk menghindari scan berulang
    const result = await addScannedItemToCart(data);

    if (result.success) {
      Alert.alert(
        'Produk Ditambahkan',
        `${result.productName} berhasil ditambahkan ke keranjang.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert(
        'Gagal',
        result.message,
        [{ text: 'Pindai Lagi', onPress: () => setScanned(false) }]
      );
    }
  };

  // 3. Tampilkan pesan sesuai status izin
  if (hasPermission === null) {
    return <Text style={styles.text}>Meminta izin kamera...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>Tidak ada akses ke kamera</Text>;
  }

  // 4. Tampilkan komponen scanner jika izin diberikan
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
          <Text style={styles.text}>Arahkan kamera ke barcode</Text>
      </View>
      {scanned && <Button title={'Ketuk untuk Memindai Lagi'} onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  },
});

export default ScannerScreen;