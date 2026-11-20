import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NutritionEntry, SavedFood } from "../../types/nutrition";
import IconButton from "./IconButton";
import { calculateServingNutrition } from "./NutritionUtils";
import { lookupProduct, type ProductData } from "./ProductLookup";
import ProductReview from "./ProductReview";

type BarcodeScannerProps = {
  onClose: () => void;
  onAddFood: (food: NutritionEntry) => void;
  onSaveFood: (food: Omit<SavedFood, "id">) => void;
};

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  primary?: boolean;
};

function ActionButton({ label, onPress, primary }: ActionButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.actionButton,
        primary
          ? { backgroundColor: theme.primary }
          : {
              backgroundColor: theme.card,
              borderColor: theme.primary,
              borderWidth: 1.5,
            },
      ]}
    >
      <Text
        style={[
          styles.actionText,
          { color: primary ? "#ffffff" : theme.primaryText },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function BarcodeScanner({
  onClose,
  onAddFood,
  onSaveFood,
}: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const hasScanned = useRef(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false); // api request is in progress
  const [product, setProduct] = useState<ProductData | null>(null); // the product we found
  const [lookupError, setLookupError] = useState<string | null>(null); // message if the api fails
  const [servingGrams, setServingGrams] = useState("100");
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === "ios" ? 24 : insets.top + 16;

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

  function resetScan() {
    hasScanned.current = false;
    setBarcode(null);
    setProduct(null);
    setLookupError(null);
    setServingGrams("100");
  }

  const parsedServingGrams = Number(servingGrams);

  const servingNutrition =
    product &&
    servingGrams.trim() !== "" &&
    Number.isFinite(parsedServingGrams) &&
    parsedServingGrams > 0
      ? calculateServingNutrition(product, parsedServingGrams)
      : null;

  // 1. Still waiting to hear about permission
  if (!permission) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]} />
    );
  }

  // 2. Permission not granted yet
  if (!permission.granted) {
    return (
      <View
        style={[
          styles.screen,
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <View
          style={[
            styles.permissionIcon,
            { backgroundColor: theme.primarySoft },
          ]}
        >
          <Ionicons name="camera-outline" size={32} color={theme.primaryText} />
        </View>
        <Text style={[styles.messageTitle, { color: theme.text }]}>
          Camera access needed
        </Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          The camera is only used to scan barcodes on food packaging.
        </Text>
        <ActionButton
          label="Allow camera"
          onPress={() => requestPermission()}
          primary
        />
        <ActionButton label="Go back" onPress={onClose} />
      </View>
    );
  }

  // 3. Camera is open and waiting for a barcode
  if (barcode === null) {
    return (
      <View style={styles.cameraScreen}>
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
          }}
        />

        <View style={styles.frameWrapper}>
          <View style={styles.frame} />
          <Text style={styles.hint}>Point the camera at a barcode</Text>
        </View>

        <View style={[styles.cameraTop, { paddingTop: topPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close scanner"
            onPress={onClose}
            style={styles.cameraClose}
          >
            <Ionicons name="close" size={22} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    );
  }

  // 4. A barcode was scanned: look up, error, or review
  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          Scanned product
        </Text>
        <View style={styles.headerButtons}>
          <IconButton
            icon="scan-outline"
            label="Scan again"
            color={theme.primaryText}
            backgroundColor={theme.primarySoft}
            onPress={resetScan}
          />
          <IconButton
            icon="close"
            label="Close"
            color={theme.text}
            backgroundColor={theme.card}
            onPress={onClose}
          />
        </View>
      </View>

      {isLookingUp ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Looking up product…
          </Text>
        </View>
      ) : lookupError ? (
        <View style={styles.center}>
          <Text style={[styles.messageTitle, { color: theme.text }]}>
            {lookupError}
          </Text>
          <ActionButton label="Scan again" onPress={resetScan} primary />
        </View>
      ) : product ? (
        <ProductReview
          product={product}
          servingGrams={servingGrams}
          nutrition={servingNutrition}
          onServingChange={setServingGrams}
          onAddFood={onAddFood}
          onSaveFood={onSaveFood}
        />
      ) : (
        <View style={styles.center}>
          <Text style={[styles.messageTitle, { color: theme.text }]}>
            No product information available.
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Barcode {barcode}
          </Text>
          <ActionButton label="Scan again" onPress={resetScan} primary />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    height: 50,
    borderRadius: 14,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cameraScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  cameraTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  cameraClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  frameWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  frame: {
    width: 280,
    height: 160,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  hint: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
});
