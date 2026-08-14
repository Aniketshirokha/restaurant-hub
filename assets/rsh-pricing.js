/**
 * @module rsh-pricing
 *
 * Shared maths for case pricing and per-piece display.
 *
 * Every function here mirrors the integer arithmetic in `snippets/rsh-per-piece.liquid`
 * and `snippets/rsh-tier-table.liquid` step for step. The server renders the first
 * paint and the client takes over on the first quantity change, so if the two
 * disagreed by a rounding step the price would visibly twitch the moment a buyer
 * touched the stepper. Keep them in sync or don't change either.
 */

/**
 * Discounted case price for a tier, in cents.
 *
 * @param {number} baseCents - Undiscounted case price in cents.
 * @param {number} discount - Whole-number percentage off, e.g. 16.
 * @returns {number} Case price in cents, rounded to the nearest cent.
 */
export function tierPriceCents(baseCents, discount) {
  return Math.floor((baseCents * (100 - discount) + 50) / 100);
}

/**
 * Per-piece price as a fixed-precision string, without a currency symbol.
 *
 * The `money` filter and Intl both round to the currency's minor unit, which
 * turns $0.208 and $0.220 into the same number. That difference is the entire
 * reason a buyer is on the page, so the fraction is built from integer maths
 * and padded rather than rounded away.
 *
 * @param {number} cents - Case price in cents.
 * @param {number} pieces - Pieces in the case.
 * @param {number} [decimals] - Decimal places, clamped to 2-4.
 * @returns {string | null} e.g. "0.220", or null when there is nothing to divide by.
 */
export function perPieceAmount(cents, pieces, decimals = 3) {
  if (!Number.isFinite(cents) || !Number.isFinite(pieces) || pieces <= 0) return null;

  const places = Math.min(4, Math.max(2, Math.round(decimals)));
  const multiplier = 10 ** (places - 2);
  const divisor = 10 ** places;

  const scaled = Math.floor((cents * multiplier + Math.floor(pieces / 2)) / pieces);
  const whole = Math.floor(scaled / divisor);
  const fraction = scaled % divisor;

  return `${whole}.${String(fraction).padStart(places, '0')}`;
}

/**
 * Per-piece price with a currency symbol in front.
 *
 * @param {number} cents - Case price in cents.
 * @param {number} pieces - Pieces in the case.
 * @param {number} [decimals] - Decimal places.
 * @param {string} [symbol] - Currency symbol.
 * @returns {string | null}
 */
export function perPieceString(cents, pieces, decimals = 3, symbol = '$') {
  const amount = perPieceAmount(cents, pieces, decimals);
  return amount === null ? null : `${symbol}${amount}`;
}

/**
 * @typedef {Object} Tier
 * @property {number} min - Lowest case count in the tier.
 * @property {number} max - Highest case count in the tier.
 * @property {number} discount - Whole-number percentage off.
 */

/**
 * Reads the ladder off a data attribute written by Liquid.
 *
 * @param {string | undefined} value - JSON array of `{min, discount}`.
 * @param {number} quoteMin - Case count at which pricing moves to a quote.
 * @returns {Tier[]}
 */
export function parseTiers(value, quoteMin) {
  if (!value) return [];

  /** @type {{min: number, discount: number}[]} */
  let parsed;

  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((tier) => Number.isFinite(tier?.min))
    .sort((a, b) => a.min - b.min)
    .map((tier, index, all) => ({
      min: tier.min,
      max: index === all.length - 1 ? quoteMin - 1 : all[index + 1].min - 1,
      discount: tier.discount ?? 0,
    }));
}

/**
 * The tier a given case count falls into.
 *
 * @param {number} cases - Case count.
 * @param {Tier[]} tiers - Ladder from {@link parseTiers}.
 * @returns {Tier | null} Null once the count is past the published ladder and needs a quote.
 */
export function tierFor(cases, tiers) {
  let match = null;

  for (const tier of tiers) {
    if (cases >= tier.min) match = tier;
  }

  return match;
}

/**
 * The next tier up from a given case count, for the "add one more case" nudge.
 *
 * @param {number} cases - Case count.
 * @param {Tier[]} tiers - Ladder from {@link parseTiers}.
 * @returns {Tier | null} Null when the buyer is already in the deepest published tier.
 */
export function nextTierFrom(cases, tiers) {
  return tiers.find((tier) => tier.min > cases) ?? null;
}

/**
 * Total cases currently in the cart.
 *
 * Every product in this catalogue is sold by the case, so one unit of line item
 * quantity is one case. If single units are ever sold this needs to start
 * reading a pieces-per-line metafield instead.
 *
 * @returns {Promise<number>} Zero when the cart cannot be read, so a failed
 * request never inflates the tier a buyer is shown.
 */
export async function fetchCartCases() {
  try {
    const cartUrl = globalThis.Theme?.routes?.cart_url ?? '/cart';
    const response = await fetch(`${cartUrl}.js`, { headers: { Accept: 'application/json' } });

    if (!response.ok) return 0;

    const cart = await response.json();

    return (cart.items ?? []).reduce((total, item) => total + (item.quantity ?? 0), 0);
  } catch {
    return 0;
  }
}
