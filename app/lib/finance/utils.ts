const formatterCache: Record<string, Intl.NumberFormat> = {};

export function formatCurrency(value: number, currency: string) {
  const key = `${currency}`.toUpperCase();
  if (!formatterCache[key]) {
    formatterCache[key] = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: key,
      maximumFractionDigits: 0,
    });
  }
  return formatterCache[key].format(value);
}

export function formatPercentage(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value}%`;
}
