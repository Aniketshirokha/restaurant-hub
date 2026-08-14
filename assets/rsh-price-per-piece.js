import { Component } from '@theme/component';
import { ThemeEvents } from '@theme/events';
import { StandardEvents } from '@shopify/events';
import { formatMoney } from '@theme/money-formatting';
import { perPieceString, tierPriceCents, parseTiers, tierFor, fetchCartCases } from '@theme/rsh-pricing';

/**
 * Case price with the per-piece price underneath, both re-pricing live as the
 * quantity changes.
 *
 * Liquid renders the correct first paint on its own, so this element only takes
 * over once a buyer touches the quantity stepper. That keeps the page useful
 * with JavaScript blocked, which matters more than usual here because the
 * per-piece number is the reason the page exists.
 *
 * @typedef {Object} PricePerPieceRefs
 * @property {HTMLElement} [casePrice]
 * @property {HTMLElement} [piecePrice]
 * @property {HTMLElement} [comparePrice]
 * @property {HTMLElement} [tierNote]
 *
 * @extends {Component<PricePerPieceRefs>}
 */
class RshPricePerPiece extends Component {
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
        // Cart line steppers bubble the same event. Only the product form's own
        // selector carries no cart line id.
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  get #cartWide() {
    return this.dataset.cartWide === 'true';
  }

  get #basePrice() {
    return Number(this.dataset.basePrice) || 0;
  }

  get #pieces() {
    return Number(this.dataset.pieces) || 0;
  }

  get #decimals() {
    return Number(this.dataset.decimals) || 3;
  }

  /** Case count the tier is judged on: what the cart would hold after adding this. */
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

  /**
   * @param {number} cents
   * @returns {string}
   */
  #money(cents) {
    const format = this.dataset.moneyFormat || '${{amount}}';
    const currency = this.dataset.currency || 'USD';

    return formatMoney(cents, format, currency);
  }

  #render() {
    const { casePrice, piecePrice, comparePrice, tierNote } = this.refs;
    const base = this.#basePrice;

    if (!base) return;

    const tiers = parseTiers(this.dataset.tiers, Number(this.dataset.quoteMin) || Infinity);
    const tier = tierFor(this.#effectiveCases, tiers);
    const discount = tier?.discount ?? 0;
    const current = tierPriceCents(base, discount);

    if (casePrice) casePrice.textContent = this.#money(current);

    if (piecePrice && this.#pieces > 0) {
      const symbol = this.dataset.symbol || '$';
      piecePrice.textContent = perPieceString(current, this.#pieces, this.#decimals, symbol) ?? '';
    }

    // The undiscounted price only appears once there is a discount to contrast
    // it against. Showing a struck-through price equal to the live one reads as
    // a fake markdown.
    if (comparePrice) {
      const showCompare = discount > 0;

      comparePrice.hidden = !showCompare;
      if (showCompare) comparePrice.textContent = this.#money(base);
    }

    if (tierNote) {
      if (discount > 0) {
        const cases = this.#effectiveCases;
        const carried = this.#cartWide && this.#cartCases > 0;

        tierNote.hidden = false;
        tierNote.textContent = carried
          ? `${discount}% off at ${cases} cases, including ${this.#cartCases} already in your cart.`
          : `${discount}% off at ${cases} cases.`;
      } else {
        tierNote.hidden = true;
      }
    }
  }
}

if (!customElements.get('rsh-price-per-piece')) {
  customElements.define('rsh-price-per-piece', RshPricePerPiece);
}
