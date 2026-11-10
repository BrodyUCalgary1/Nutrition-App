import {
    CameraView,
    useCameraPermissions,
    type BarcodeScanningResult,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { lookupProduct, type ProductData } from "./ProductLookup";

type BarcodeScannerProps = {
  onClose: () => void;
};

export default function BarcodeScanner({ onClose }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const hasScanned = useRef(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false); //api request is in progress0
  const [product, setProduct] = useState<ProductData | null>(null); //stroes the product name
  const [lookupError, setLookupError] = useState<string | null>(null); //stores the error message if the api fails

  async function handleBarcodeScanned(result: BarcodeScanningResult) {
    if (hasScanned.current) return;

    hasScanned.current = true;
    setBarcode(result.data);
    setIsLookingUp(true);
    setLookupError(null);
    setProduct(null);

    try {
      const data = await lookupProduct(result.data);

      setProduct(data);
    } catch (error) {
      console.error("Product lookup failed:", error);
      setLookupError("Something went wrong looking up this product.");
    } finally {
      setIsLookingUp(false);
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need camera access to scan barcodes.</Text>
        <Button title="Grant Camera Permission" onPress={requestPermission} />
        <Button title="Go Back" onPress={onClose} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {barcode === null ? (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
        />
      ) : (
        <View>
          <Text>Barcode detected!</Text>
          <Text>{barcode}</Text>

          {isLookingUp ? (
            <Text>Looking up product...</Text>
          ) : lookupError ? (
            <Text>{lookupError}</Text>
          ) : product ? (
            <View>
              <Text>Product: {product.name}</Text>
              <Text>Brand: {product.brand || "Unknown"}</Text>
              <Text>Serving Size: {product.servingSize || "Unavailable"}</Text>

              <Text>
                Calories: {product.caloriesPer100g ?? "Unavailable"} kcal / 100g
              </Text>
              <Text>
                Protein: {product.proteinPer100g ?? "Unavailable"} g / 100g
              </Text>
              <Text>
                Carbs: {product.carbsPer100g ?? "Unavailable"} g / 100g
              </Text>
              <Text>Fat: {product.fatPer100g ?? "Unavailable"} g / 100g</Text>
            </View>
          ) : (
            <Text>No product information available.</Text>
          )}

          <Button
            title="Scan Again"
            onPress={() => {
              hasScanned.current = false;
              setBarcode(null);
              setProduct(null);
              setLookupError(null);
            }}
          />
        </View>
      )}

      <Button title="Go Back" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
});
