import { Component } from '@theme/component';
import { fetchConfig } from '@theme/utilities';
import { formatMoney } from '@theme/money-formatting';

/**
 * Quick order pad. A returning buyer pastes their reorder list and gets a cart.
 *
 * Restaurant supply is the same list most weeks. Every competitor makes a
 * returning buyer navigate the catalogue again from scratch, which is why this
 * exists.
 *
 * Each line is `SKU`, `SKU, 4`, `SKU 4` or `SKU x4`. Lookups run against the
 * search.sku template, which only returns exact SKU matches, so a typo comes back
 * as a visible miss rather than the wrong case quietly landing in the cart.
 *
 * @typedef {Object} QuickOrderRefs
 * @property {HTMLTextAreaElement} [input]
 * @property {HTMLElement} [results]
 * @property {HTMLElement} [status]
 * @property {HTMLButtonElement} [submit]
 *
 * @extends {Component<QuickOrderRefs>}
 */
class RshQuickOrder extends Component {
  requiredRefs = ['input', 'results', 'status', 'submit'];

  #abortController = new AbortController();
  #busy = false;

  connectedCallback() {
    super.connectedCallback();

    const { signal } = this.#abortController;

    this.refs.submit?.addEventListener('click', (event) => {
      event.preventDefault();
      this.#run();
    });

    this.addEventListener(
      'keydown',
      (event) => {
        // Ctrl/Cmd + Enter submits, so a buyer pasting a list never has to reach
        // for the mouse.
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          this.#run();
        }
      },
      { signal }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  /**
   * Splits the pasted text into SKU and quantity pairs.
   *
   * @param {string} raw
   * @returns {{ sku: string, quantity: number }[]}
   */
  #parse(raw) {
    return raw
      .split(/[\r\n]+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // Accepts "SKU", "SKU, 4", "SKU 4", "SKU x4" and tab separated columns
        // pasted straight out of a spreadsheet.
        const match = line.match(/^(.+?)(?:[\s,;\t]+x?\s*(\d+))?$/i);

        if (!match) return null;

        const sku = (match[1] ?? '').trim().replace(/[,;]$/, '');
        const quantity = Math.max(1, parseInt(match[2] ?? '1', 10) || 1);

        return sku ? { sku, quantity } : null;
      })
      .filter((line) => line !== null);
  }

  /**
   * @param {string} sku
   * @returns {Promise<any | null>}
   */
  async #lookup(sku) {
    const searchUrl = globalThis.Theme?.routes?.search_url ?? '/search';
    const url = `${searchUrl}?q=${encodeURIComponent(sku)}&view=sku&type=product`;

    try {
      const response = await fetch(url, { signal: this.#abortController.signal });

      if (!response.ok) return null;

      const data = await response.json();
      const items = Array.isArray(data.items) ? data.items : [];

      return items[0] ?? null;
    } catch {
      return null;
    }
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

  async #run() {
    if (this.#busy) return;

    const { input, results, status, submit } = this.refs;

    if (!input || !results || !status) return;

    const lines = this.#parse(input.value);

    results.replaceChildren();

    if (!lines.length) {
      status.textContent = 'Add at least one item number.';
      return;
    }

    this.#busy = true;
    if (submit) submit.disabled = true;
    status.textContent = `Looking up ${lines.length} ${lines.length === 1 ? 'item' : 'items'}…`;

    const found = [];
    const missing = [];

    // Resolved in order so the feedback list reads back in the same order the
    // buyer pasted, which is how they will check it against their own list.
    for (const line of lines) {
      const match = await this.#lookup(line.sku);

      if (match && match.available) {
        found.push({ ...match, quantity: line.quantity });
        results.append(this.#renderLine(match, line.quantity));
      } else {
        missing.push(line.sku);
        results.append(this.#renderMiss(line.sku, match ? 'out of stock' : 'not found'));
      }
    }

    if (!found.length) {
      status.textContent = 'None of those item numbers matched. Check them and try again.';
      this.#busy = false;
      if (submit) submit.disabled = false;
      return;
    }

    try {
      const response = await fetch(globalThis.Theme?.routes?.cart_add_url ?? '/cart/add.js', {
        ...fetchConfig('json', {
          body: JSON.stringify({
            items: found.map((item) => ({ id: item.id, quantity: item.quantity })),
          }),
        }),
        signal: this.#abortController.signal,
      });

      if (!response.ok) throw new Error(String(response.status));

      const cases = found.reduce((total, item) => total + item.quantity, 0);
      const skipped = missing.length ? ` ${missing.length} not added.` : '';

      status.textContent = `Added ${cases} ${cases === 1 ? 'case' : 'cases'} to your cart.${skipped}`;

      if (this.dataset.redirect === 'true') {
        window.location.href = globalThis.Theme?.routes?.cart_url ?? '/cart';
        return;
      }

      // Tells the cart icon, drawer and free shipping bar to catch up.
      document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
    } catch {
      status.textContent = 'Those items could not be added. Try again, or add them from their product pages.';
    } finally {
      this.#busy = false;
      if (submit) submit.disabled = false;
    }
  }

  /**
   * @param {any} match
   * @param {number} quantity
   * @returns {HTMLElement}
   */
  #renderLine(match, quantity) {
    const row = document.createElement('div');
    row.className = 'rsh-quick__line';

    const code = document.createElement('span');
    code.className = 'rsh-quick__code';
    code.textContent = match.sku;

    const detail = document.createElement('span');
    detail.className = 'rsh-quick__detail';
    detail.textContent = `${quantity} × ${match.title} · ${this.#money(match.price)}`;

    row.append(code, detail);

    return row;
  }

  /**
   * @param {string} sku
   * @param {string} reason
   * @returns {HTMLElement}
   */
  #renderMiss(sku, reason) {
    const row = document.createElement('div');
    row.className = 'rsh-quick__line rsh-quick__line--error';

    const code = document.createElement('span');
    code.className = 'rsh-quick__code';
    code.textContent = sku;

    const detail = document.createElement('span');
    detail.className = 'rsh-quick__detail';
    detail.textContent = reason;

    row.append(code, detail);

    return row;
  }
}

if (!customElements.get('rsh-quick-order')) {
  customElements.define('rsh-quick-order', RshQuickOrder);
}
