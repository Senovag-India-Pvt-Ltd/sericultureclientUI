// Shared display formatter for target/achievement quantity values.
// Shows up to 5 decimal places, but trims trailing zeros — a whole
// number (including 0) renders without a decimal point at all.
export const formatQty = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return null;
  return String(parseFloat(num.toFixed(5)));
};
