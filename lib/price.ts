export type PriceInput = number | string;

export function parsePriceToCents(value: PriceInput) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value * 100) : 0;
  }

  const numericValue = Number(normalizePriceString(value));

  return Number.isFinite(numericValue) ? Math.round(numericValue * 100) : 0;
}

export function formatPrice(value: PriceInput) {
  return formatPriceFromCents(parsePriceToCents(value));
}

export function formatPriceFromCents(cents: number) {
  const roundedCents = Number.isFinite(cents) ? Math.round(cents) : 0;
  const sign = roundedCents < 0 ? "-" : "";
  const absoluteCents = Math.abs(roundedCents);
  const whole = Math.floor(absoluteCents / 100);
  const decimal = String(absoluteCents % 100).padStart(2, "0");

  return `${sign}${whole}.${decimal} ₾`;
}

function normalizePriceString(value: string) {
  const cleaned = value.trim().replace(/[^\d.,-]/g, "");
  const decimalIndex = Math.max(cleaned.lastIndexOf("."), cleaned.lastIndexOf(","));

  if (!cleaned) {
    return "0";
  }

  if (decimalIndex === -1) {
    return cleaned.replace(/[^\d-]/g, "") || "0";
  }

  const integerPart = cleaned.slice(0, decimalIndex).replace(/[^\d-]/g, "") || "0";
  const decimalPart = cleaned
    .slice(decimalIndex + 1)
    .replace(/\D/g, "")
    .slice(0, 2)
    .padEnd(2, "0");

  return `${integerPart}.${decimalPart}`;
}
