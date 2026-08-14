import { Component } from '@theme/component';
import { ThemeEvents } from '@theme/events';
import { StandardEvents } from '@shopify/events';
import { formatMoney } from '@theme/money-formatting';
import { parseTiers, nextTierFrom, tierPriceCents, fetchCartCases } from '@theme/rsh-pricing';

/**
 * Keeps the volume ladder in step with the quantity selector: highlights the row
 * the buyer is currently in, and tells them how many more cases reach the next
 * one.
 *
 * Highlighting the live row is the single interaction on the product page that
 * does real selling, so the rows are rendered by Liquid and only re-marked here.
 * Nothing about the ladder depends on this script running.
 *
 * @typedef {Object} TierTableRefs
 * @property {HTMLElement} [nudge]
 * @property {HTMLElement} [nudgeText]
 *
 * @extends {Component<TierTableRefs>}
 */
class RshTierTable extends Component {
  #abortController = new AbortController();
  #cartCases = 0;
  #quantity = 1;

  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.#abortController;
    const scope = this.closest('.shopify-section') ?? document;

    this.#quantity = this.#readQuantityInput() ?? 1;

    scope.addEventListener(
      ThemeEvents.quantitySelectorUpdate,
      (event) => {
        if (event.detail?.cartLine != null) return;
        if (!Number.isFinite(event.detail?.quantity)) return;

        this.#quantity = event.detail.quantity;
        this.#render();
      },
      { signal }
    );

    if (this.#cartWide) {
      this.#loadCartCases();

      document.addEventListener(StandardEvents.cartLinesUpdate, () => this.#loadCartCases(), { signal });
    }

    this.#render();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  get #cartWide() {
    return this.dataset.cartWide === 'true';
  }

  get #effectiveCases() {
    return this.#cartWide ? this.#cartCases + this.#quantity : this.#quantity;
  }

  async #loadCartCases() {
    this.#cartCases = await fetchCartCases();
    this.#render();
  }

  /**
   * @returns {number | null}
   */
  #readQuantityInput() {
    const scope = this.closest('.shopify-section') ?? document;
    const input = scope.querySelector('input[name="quantity"]');

    if (!(input instanceof HTMLInputElement)) return null;

    const value = Number(input.value);

    return Number.isFinite(value) && value > 0 ? value : null;
  }

  #render() {
    const cases = this.#effectiveCases;

    this.#markActiveRow(cases);
    this.#renderNudge(cases);
  }

  /**
   * @param {number} cases
   */
  #markActiveRow(cases) {
    for (const row of this.querySelectorAll('.rsh-tier__row')) {
      if (!(row instanceof HTMLElement)) continue;

      const min = Number(row.dataset.min);
      const max = Number(row.dataset.max);
      const active = cases >= min && cases <= max;

      row.classList.toggle('rsh-tier__row--active', active);
    }
  }

  /**
   * @param {number} cases
   */
  #renderNudge(cases) {
    const { nudge, nudgeText } = this.refs;

    if (!nudge || !nudgeText) return;

    const base = Number(this.dataset.basePrice) || 0;
    const quoteMin = Number(this.dataset.quoteMin) || Infinity;
    const tiers = parseTiers(this.dataset.tiers, quoteMin);
    const next = nextTierFrom(cases, tiers);

    // Past the deepest published tier there is nothing to upsell towards, and a
    // buyer in that range is heading for a quote anyway.
    if (!next || !base) {
      nudge.hidden = true;
      return;
    }

    const needed = next.min - cases;
    const withinReach = Number(this.dataset.nudgeWindow) || 2;

    // Only nudge when the next tier is genuinely close. "Add 23 more cases" is
    // not a nudge, it is a reason to stop reading.
    if (needed <= 0 || needed > withinReach) {
      nudge.hidden = true;
      return;
    }

    const format = this.dataset.moneyFormat || '${{amount}}';
    const currency = this.dataset.currency || 'USD';
    const nextPrice = formatMoney(tierPriceCents(base, next.discount), format, currency);
    const noun = needed === 1 ? 'case' : 'cases';

    nudgeText.textContent = `Add ${needed} more ${noun} and every case drops to ${nextPrice}.`;
    nudge.hidden = false;
  }
}

if (!customElements.get('rsh-tier-table')) {
  customElements.define('rsh-tier-table', RshTierTable);
}
