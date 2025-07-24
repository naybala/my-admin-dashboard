import type { Product } from "@customTypes/index";

export function validateProductForm(
  product: Product,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!product.name || product.name.trim() === "") {
    errors.name = t("products.nameRequired");
  }

  return errors;
}
