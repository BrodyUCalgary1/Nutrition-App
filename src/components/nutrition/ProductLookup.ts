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

const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type CachedProduct = {
  product: ProductData;
  cachedAt: number; // when we saved it, in milliseconds
};

function isValidCachedProduct(value: unknown): value is CachedProduct {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.cachedAt === "number" &&
    Number.isFinite(entry.cachedAt) &&
    isValidProductData(entry.product)
  );
}

// Ask Open Food Facts for a product. Returns null if it doesn't know it.
async function fetchProduct(barcode: string): Promise<ProductData | null> {
  const url = `${API_BASE_URL}/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,quantity,serving_size,nutrition`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "NutritionApp/1.0 (https://github.com/BrodyUCalgary1/Nutrition-App)",
    },
  });

  // Open Food Facts answers 404 for barcodes it doesn't know
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data: ProductLookupResponse = await response.json();

  // Some "not found" replies come back as a normal response with no product
  if (!data.product) {
    return null;
  }

  return convertProductData(data);
}

export async function lookupProduct(
  barcode: string,
): Promise<ProductData | null> {
  const cacheKey = `productCache:${barcode}`;
  let staleProduct: ProductData | null = null;

  // STEP 1: Check local cache
  try {
    const cachedValue = await AsyncStorage.getItem(cacheKey);

    if (cachedValue !== null) {
      const parsed: unknown = JSON.parse(cachedValue);

      if (isValidCachedProduct(parsed)) {
        const age = Date.now() - parsed.cachedAt;

        if (age >= 0 && age < CACHE_MAX_AGE_MS) {
          console.log("Product found in cache:", barcode);
          return parsed.product;
        }

        // Too old: fetch a fresh copy, but keep this one as a fallback
        console.log("Cached product expired:", barcode);
        staleProduct = parsed.product;
      } else {
        console.warn("Cached product was invalid, removing:", barcode);
        await AsyncStorage.removeItem(cacheKey);
      }
    }
  } catch (error) {
    console.warn("Cache lookup failed:", error);
    await AsyncStorage.removeItem(cacheKey).catch(() => {});
  }

  // STEP 2: Not cached (or expired) - request the product from the API
  console.log("Requesting API:", barcode);

  let product: ProductData | null;

  try {
    product = await fetchProduct(barcode);
  } catch (error) {
    // The request failed. An old copy beats an error message.
    if (staleProduct) {
      console.warn("API failed, using expired cache:", barcode);
      return staleProduct;
    }

    throw error;
  }

  // STEP 3: The API doesn't know this product - forget any old copy
  if (product === null) {
    await AsyncStorage.removeItem(cacheKey).catch(() => {});
    return null;
  }

  // STEP 4: Save the product with the time we saved it
  try {
    const entry: CachedProduct = { product, cachedAt: Date.now() };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn("Could not save product to cache:", error);
  }

  // STEP 5: Return the product
  return product;
}
