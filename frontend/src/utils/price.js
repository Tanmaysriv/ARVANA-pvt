/**
 * Calculate discount percentage from price and originalPrice.
 * @param {number} price - Sale price
 * @param {number} originalPrice - Original (MRP) price
 * @returns {number} Discount percentage (0–100)
 */
export const getDiscountPercent = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= 0) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

/**
 * Sort comparator: highest discount first.
 */
export const sortByDiscount = (a, b) => {
  const dA = ((a.originalPrice - a.price) / a.originalPrice) * 100
  const dB = ((b.originalPrice - b.price) / b.originalPrice) * 100
  return dB - dA
}
