import { Component } from '@theme/component';
import { formatMoney } from '@theme/money-formatting';
import { parseTiers, tierFor, tierPriceCents, perPieceAmount } from '@theme/rsh-pricing';

/**
 * The hero's price calculator.
 *
 * Drag the case count and the published ladder applies in front of the buyer.
 * None of the arithmetic lives here: it comes from the same `rsh-pricing`
 * module the product page uses, reading the ladder the theme settings define,
 * so the hero cannot quote a price the product page contradicts.
 *
 * The panel renders with em dashes and fills in on connect, so a blocked script
 * leaves a panel that says nothing rather than one that says something wrong.
 */
class RshHeroPrice extends Component {
  #abort = null;

  connectedCallback() {
    super.connectedCallback();

    this.range = this.querySelector('[data-range]');
    if (!this.range) return;

    this.#abort = new AbortController();

    this.base = Number(this.dataset.basePrice) || 0;
    this.pieces = Number(this.dataset.pieces) || 0;
    this.decimals = Number(this.dataset.decimals) || 3;
    this.format = this.dataset.moneyFormat || '${{amount}}';
    this.currency = this.dataset.currency || 'USD';

    const max = Number(this.dataset.max) || 49;
    this.tiers = parseTiers(this.dataset.tiers, max + 1);

    // The symbol the shop actually prints, so the per-piece line matches the
    // case line instead of assuming dollars.
    this.symbol = (this.format.match(/^[^{]*/) || ['$'])[0].trim() || '$';

    this.range.addEventListener('input', () => this.#render(), {
      signal: this.#abort.signal,
    });

    this.#render();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#abort?.abort();
    this.#abort = null;
  }

  #render() {
    const cases = Number(this.range.value) || 1;
    const tier = tierFor(cases, this.tiers);
    const discount = tier ? tier.discount : 0;
    const caseCents = tierPriceCents(this.base, discount);

    const set = (selector, value) => {
      const node = this.querySelector(selector);
      if (node) node.textContent = value;
    };

    set('[data-cases]', String(cases));
    set('[data-case-price]', formatMoney(caseCents, this.format, this.currency));

    const piece = perPieceAmount(caseCents, this.pieces, this.decimals);
    set('[data-piece-price]', piece ? this.symbol + piece : '—');

    // Only worth naming once there is a saving to name.
    const saving = (this.base - caseCents) * cases;
    const savingNode = this.querySelector('[data-saving]');
    if (!savingNode) return;

    if (saving <= 0) {
      savingNode.hidden = true;
      return;
    }

    const amount = formatMoney(saving, this.format, this.currency);
    savingNode.textContent = `${discount}% off at ${cases} cases — ${amount} back on this order.`;
    savingNode.hidden = false;
  }
}

if (!customElements.get('rsh-hero-price')) {
  customElements.define('rsh-hero-price', RshHeroPrice);
}
