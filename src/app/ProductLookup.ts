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

export async function lookupProduct(barcode: string): Promise<ProductData> {
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

  return convertProductData(data);
}
