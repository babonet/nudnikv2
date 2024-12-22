import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

type Props = {
  route: {
    params: {
      type: 'qrCode' | 'barCode';
      onScan: (code: string) => void;
    }
  };
  navigation: any;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCAN_AREA_SIZE = SCREEN_WIDTH * 0.7; // 70% of screen width

export const ScannerScreen = ({ route, navigation }: Props) => {
  const { type, onScan } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    onScan(data);
    navigation.goBack();
  };

  if (hasPermission === null) return <Text>Requesting camera permission</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: type === 'qrCode' ? ["qr"] : ["ean13", "ean8", "upc_e", "code128", "code39", "code93", "itf14", "codabar", "pdf417", "aztec", "datamatrix"]
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}/>
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}/>
          <View style={styles.focusedContainer}>
            {/* Scanner corners */}
            <View style={[styles.corner, styles.topLeft]}/>
            <View style={[styles.corner, styles.topRight]}/>
            <View style={[styles.corner, styles.bottomLeft]}/>
            <View style={[styles.corner, styles.bottomRight]}/>
          </View>
          <View style={styles.unfocusedContainer}/>
        </View>
        <View style={styles.unfocusedContainer}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleContainer: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  focusedContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
}); 