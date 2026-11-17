import AsyncStorage from "@react-native-async-storage/async-storage";
const API_BASE_URL = "https://world.openfoodfacts.org/api/v3.6/product";

export type ProductData = {
  barcode: string;
  name: string;
  brand: string;
  quantity: string;
  servingSize: string;
  caloriesPer100g: number | null;
  proteinPer100g: number | null;
  carbsPer100g: number | null;
  fatPer100g: number | null;
};

type Nutrient = {
  value?: number;
};

type ProductLookupResponse = {
  code?: string;
  product?: {
    code?: string;
    product_name?: string;
    brands?: string;
    quantity?: string;
    serving_size?: string;
    nutrition?: {
      aggregated_set?: {
        nutrients?: {
          "energy-kcal"?: Nutrient;
          proteins?: Nutrient;
          carbohydrates?: Nutrient;
          fat?: Nutrient;
        };
      };
    };
  };
};

export function convertProductData(data: ProductLookupResponse): ProductData {
  const product = data.product;
  const nutrients = product?.nutrition?.aggregated_set?.nutrients;

  return {
    barcode: product?.code || data.code || "",
    name: product?.product_name || "Unknown product",
    brand: product?.brands || "",
    quantity: product?.quantity || "",
    servingSize: product?.serving_size || "",

    caloriesPer100g: nutrients?.["energy-kcal"]?.value ?? null,
    proteinPer100g: nutrients?.proteins?.value ?? null,
    carbsPer100g: nutrients?.carbohydrates?.value ?? null,
    fatPer100g: nutrients?.fat?.value ?? null,
  };
}

function isNumberOrNull(value: unknown): boolean {
  return (
    value === null || (typeof value === "number" && Number.isFinite(value))
  );
}

function isValidProductData(value: unknown): value is ProductData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.barcode === "string" &&
    product.barcode !== "" &&
    typeof product.name === "string" &&
    typeof product.brand === "string" &&
    typeof product.quantity === "string" &&
    typeof product.servingSize === "string" &&
    isNumberOrNull(product.caloriesPer100g) &&
    isNumberOrNull(product.proteinPer100g) &&
    isNumberOrNull(product.carbsPer100g) &&
    isNumberOrNull(product.fatPer100g)
  );
}

export async function lookupProduct(barcode: string): Promise<ProductData> {
  const cacheKey = `productCache:${barcode}`;

  // STEP 1: Check local cache
  // STEP 1: Check local cache
  try {
    const cachedProduct = await AsyncStorage.getItem(cacheKey);

    if (cachedProduct !== null) {
      const parsed: unknown = JSON.parse(cachedProduct);

      if (isValidProductData(parsed)) {
        console.log("Product found in cache:", barcode);
        return parsed;
      }

      console.warn("Cached product was invalid, removing:", barcode);
      await AsyncStorage.removeItem(cacheKey);
    }
  } catch (error) {
    console.warn("Cache lookup failed:", error);
    await AsyncStorage.removeItem(cacheKey).catch(() => {});
  }

  // STEP 2: Cache miss - request product from API
  console.log("Product not cached. Requesting API:", barcode);

  const url = `${API_BASE_URL}/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,quantity,serving_size,nutrition`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "NutritionApp/1.0 (https://github.com/BrodyUCalgary1/Nutrition-App)",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  // STEP 3: Convert API response into our ProductData format
  const product = convertProductData(data);

  // STEP 4: Save product to local cache
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(product));
  } catch (error) {
    console.warn("Could not save product to cache:", error);
  }

  // STEP 5: Return product
  return product;
}
