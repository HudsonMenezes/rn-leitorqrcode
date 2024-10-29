import { useRef, useState } from "react";
import { Button, StyleSheet, View, Modal, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const qrCodeLock = useRef(false); // Lock to prevent multiple reads

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();

      if (!granted) {
        return Alert.alert(
          "Permissão negada",
          "Você precisa permitir o acesso à câmera para usar essa funcionalidade."
        );
      }

      setModalIsVisible(true);
      qrCodeLock.current = false; // Reset lock
    } catch (error) {
      console.log(error);
    }
  }

  function handleQRCodeRead(data: string) {
    setModalIsVisible(false);
    Alert.alert("QRCode", data);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Button title="Ler QRCode" onPress={handleOpenCamera} />

      <Modal visible={modalIsVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.cameraContainer}>
            <CameraView
              facing="back"
              style={styles.camera}
              onBarcodeScanned={({ data }) => {
                if (data && !qrCodeLock.current) {
                  // Check if data is not empty and lock is not active
                  qrCodeLock.current = true;
                  setTimeout(() => handleQRCodeRead(data), 500);
                }
              }}
            />
          </View>
          <View style={styles.footer}>
            <Button title="Cancelar" onPress={() => setModalIsVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    width: "80%",
    height: "50%",
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  camera: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 32,
    right: 32,
  },
});
