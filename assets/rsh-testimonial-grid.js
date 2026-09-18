/**
 * Twenty quotes, three at a time.
 *
 * The cards past the first three ship with `hidden` already set, so the page
 * paints once and nothing jumps. This wires the button: each press shows the
 * next three, the new cards arriving 70ms apart; once everything is out the
 * same button folds the grid back to three and returns to the heading. In the
 * theme editor, picking a hidden card in the sidebar reveals up to it, so the
 * editor can scroll to and outline it.
 *
 * Without the script every card shows and the button is hidden by the
 * section's <noscript> rule, so nothing depends on this file to be read.
 */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

class RshTestimonialGrid extends HTMLElement {
  #abort = null;

  connectedCallback() {
    this.items = Array.from(this.querySelectorAll('[data-item]'));
    this.button = this.querySelector('[data-more]');
    this.label = this.querySelector('[data-more-label]');
    this.count = this.querySelector('[data-more-count]');
    this.status = this.querySelector('[data-status]');
    this.visible = Math.max(1, Number(this.dataset.visible) || 3);
    if (!this.button || this.items.length <= this.visible) return;

    this.#abort = new AbortController();
    const { signal } = this.#abort;
    this.dataset.enhanced = 'true';

    this.button.addEventListener('click', () => this.#toggle(), { signal });

    this.addEventListener(
      'shopify:block:select',
      (event) => {
        const item = event.target?.closest?.('[data-item]');
        if (!item || !item.hidden) return;
        this.#show(this.items.indexOf(item) + 1, false);
      },
      { signal }
    );

    this.#show(this.visible, false);
  }

  disconnectedCallback() {
    this.#abort?.abort();
  }

  get shown() {
    return this.items.filter((item) => !item.hidden).length;
  }

  #toggle() {
    const shown = this.shown;
    if (shown >= this.items.length) {
      this.#show(this.visible, false);
      this.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });
      this.button.focus({ preventScroll: true });
      return;
    }
    this.#show(Math.min(this.items.length, shown + this.visible), true);
  }

  #show(count, animate) {
    const before = this.shown;
    let firstNew = null;

    this.items.forEach((item, index) => {
      const show = index < count;
      if (show && item.hidden) {
        item.hidden = false;
        if (animate && !reduced.matches) {
          item.style.setProperty('--rsh-tgrid-i', String(index - before));
          item.classList.add('is-new');
          item.addEventListener('animationend', () => item.classList.remove('is-new'), { once: true });
        }
        firstNew ??= item;
      } else if (!show && !item.hidden) {
        item.hidden = true;
        item.classList.remove('is-new');
      }
    });

    const total = this.items.length;
    const all = count >= total;
    const allowFewer = this.hasAttribute('data-allow-fewer');

    if (this.label) this.label.textContent = all ? this.dataset.fewerLabel : this.dataset.moreLabel;
    if (this.count) {
      this.count.hidden = all;
      this.count.textContent = String(total - count);
    }
    this.button.hidden = all && !allowFewer;
    this.button.setAttribute('aria-expanded', String(count > this.visible));

    if (this.status) {
      this.status.textContent = (this.dataset.statusTemplate || 'Showing [shown] of [total]')
        .replace('[shown]', String(count))
        .replace('[total]', String(total));
    }

    // Keyboard and screen-reader users land on the first card that just came in.
    if (animate && firstNew && count > before) {
      firstNew.querySelector('[tabindex]')?.focus({ preventScroll: true });
    }
  }
}

if (!customElements.get('rsh-testimonial-grid')) {
  customElements.define('rsh-testimonial-grid', RshTestimonialGrid);
}
