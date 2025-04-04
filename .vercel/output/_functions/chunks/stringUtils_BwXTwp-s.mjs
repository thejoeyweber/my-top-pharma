function formatMarketCap(marketCap) {
  const num = typeof marketCap === "string" ? parseFloat(marketCap) : marketCap;
  if (isNaN(num)) return "N/A";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
}

export { formatMarketCap as f };
