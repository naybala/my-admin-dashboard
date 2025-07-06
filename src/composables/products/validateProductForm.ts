import type { Product } from "../../types";

export function validateProductForm(
  product: Product,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!product.name || product.name.trim() === "") {
    errors.name = t("products.nameRequired");
  }

  if (!product.categoryId || product.categoryId <= 0) {
    errors.categoryId = t("products.categoryRequired");
  }


  return errors;
}
