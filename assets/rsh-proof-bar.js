import { Component } from '@theme/component';

/**
 * The strip under the hero: one customer line at a time, rotating, beside the
 * figures the shop stands behind.
 *
 * Progressive enhancement. The markup ships with the first quote visible, the
 * rest carrying `hidden` and the dots hidden outright, so a blocked script
 * leaves one readable sentence instead of a stack of them or a row of dots
 * that page through nothing. This stacks the quotes, reveals the dots and
 * starts the rotation.
 *
 * Rotation is decoration, so it yields to every sign that the strip is being
 * read: a pointer over it, focus inside it, a backgrounded tab, a scroll past
 * it, or a stated preference for reduced motion. Clicking a dot stops it for
 * good — someone who picked a quote wants to finish reading it.
 */
class RshProofBar extends Component {
  #abort = null;
  #observer = null;
  #quotes = [];
  #dots = [];
  #index = 0;
  #timer = null;
  #interval = 0;
  #running = false;
  #holds = new Set();

  connectedCallback() {
    super.connectedCallback();

    this.#quotes = Array.from(this.querySelectorAll('[data-quote]'));
    // One quote rotates nowhere, and the markup already reads correctly.
    if (this.#quotes.length < 2) return;

    this.#dots = Array.from(this.querySelectorAll('[data-dot]'));
    this.#abort = new AbortController();
    const { signal } = this.#abort;

    this.dataset.enhanced = 'true';

    for (const quote of this.#quotes) quote.hidden = false;

    const dots = this.querySelector('[data-dots]');
    if (dots) dots.hidden = false;

    for (const dot of this.#dots) {
      dot.addEventListener(
        'click',
        () => {
          this.#show(Number(dot.dataset.index));
          this.#running = false;
          this.#sync();
        },
        { signal }
      );
    }

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const readInterval = () => {
      this.#interval = reduced.matches ? 0 : Number(this.dataset.interval) || 0;
      this.#sync();
    };
    reduced.addEventListener('change', readInterval, { signal });

    this.addEventListener('pointerenter', () => this.#hold('pointer'), { signal });
    this.addEventListener('pointerleave', () => this.#release('pointer'), { signal });
    this.addEventListener('focusin', () => this.#hold('focus'), { signal });
    this.addEventListener('focusout', () => this.#release('focus'), { signal });

    const readVisibility = () => {
      if (document.hidden) this.#hold('tab');
      else this.#release('tab');
    };
    document.addEventListener('visibilitychange', readVisibility, { signal });
    readVisibility();

    if ('IntersectionObserver' in window) {
      this.#observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.#release('offscreen');
            else this.#hold('offscreen');
          }
        },
        { threshold: 0 }
      );
      this.#observer.observe(this);
    }

    this.#show(0);
    this.#running = true;
    readInterval();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#abort?.abort();
    this.#observer?.disconnect();
    clearInterval(this.#timer);
    this.#timer = null;
  }

  #hold(reason) {
    this.#holds.add(reason);
    this.#sync();
  }

  #release(reason) {
    this.#holds.delete(reason);
    this.#sync();
  }

  #sync() {
    clearInterval(this.#timer);
    this.#timer = null;
    if (!this.#running || !this.#interval || this.#holds.size) return;
    this.#timer = setInterval(() => this.#show(this.#index + 1), this.#interval);
  }

  #show(target) {
    const total = this.#quotes.length;
    const next = ((target % total) + total) % total;
    this.#index = next;

    this.#quotes.forEach((quote, position) => {
      const on = position === next;
      quote.classList.toggle('is-active', on);
      // The quotes that are not showing still hold the strip's height open, so
      // they have to be taken off the screen reader's path deliberately.
      quote.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) quote.removeAttribute('inert');
      else quote.setAttribute('inert', '');
    });

    this.#dots.forEach((dot, position) => {
      const on = position === next;
      dot.classList.toggle('is-active', on);
      if (on) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }
}

if (!customElements.get('rsh-proof-bar')) {
  customElements.define('rsh-proof-bar', RshProofBar);
}
