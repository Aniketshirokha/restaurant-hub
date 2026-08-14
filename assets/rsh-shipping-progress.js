import { Component } from '@theme/component';
import { StandardEvents } from '@shopify/events';
import { formatMoney } from '@theme/money-formatting';

/**
 * "You're $34 from free shipping."
 *
 * The most reliable basket-size lever there is, and the reason the threshold is
 * set where it is. Liquid renders the state on load; this only keeps it honest
 * as lines change without a page reload.
 *
 * @typedef {Object} ShippingProgressRefs
 * @property {HTMLElement} [text]
 * @property {HTMLElement} [fill]
 *
 * @extends {Component<ShippingProgressRefs>}
 */
class RshShippingProgress extends Component {
  #abortController = new AbortController();

  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.#abortController;

    document.addEventListener(StandardEvents.cartLinesUpdate, () => this.#refresh(), { signal });
    document.addEventListener('cart:refresh', () => this.#refresh(), { signal });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  async #refresh() {
    try {
      const cartUrl = globalThis.Theme?.routes?.cart_url ?? '/cart';
      const response = await fetch(`${cartUrl}.js`, { headers: { Accept: 'application/json' } });

      if (!response.ok) return;

      const cart = await response.json();

      this.#render(cart.total_price ?? 0);
    } catch {
      // A failed cart read leaves the server-rendered state in place, which is
      // stale at worst. Guessing at a total would be worse.
    }
  }

  /**
   * @param {number} total - Cart total in cents.
   */
  #render(total) {
    const { text, fill } = this.refs;
    const threshold = Number(this.dataset.threshold) || 0;

    if (!threshold || !text || !fill) return;

    const remaining = Math.max(0, threshold - total);
    const met = remaining === 0;
    const percent = Math.min(100, Math.round((total / threshold) * 100));

    this.classList.toggle('rsh-ship--met', met);
    fill.style.width = `${percent}%`;
    fill.parentElement?.setAttribute('aria-valuenow', String(percent));

    if (met) {
      text.textContent = this.dataset.metText || 'Your order ships free.';
      return;
    }

    const format = this.dataset.moneyFormat || '${{amount}}';
    const currency = this.dataset.currency || 'USD';
    const template = this.dataset.awayText || "You're [amount] from free shipping.";

    // Built as nodes rather than a string of HTML so the merchant's copy is
    // always inserted as text, whatever it happens to contain.
    const amount = document.createElement('strong');
    amount.textContent = formatMoney(remaining, format, currency);

    const [before, after = ''] = template.split('[amount]');

    text.replaceChildren(document.createTextNode(before), amount, document.createTextNode(after));
  }
}

if (!customElements.get('rsh-shipping-progress')) {
  customElements.define('rsh-shipping-progress', RshShippingProgress);
}
