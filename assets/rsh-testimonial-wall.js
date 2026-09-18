import { Component } from '@theme/component';
import { lockScroll, unlockScroll } from '@theme/utilities';

/**
 * A wall of testimonial cards, each opening into a dialog that holds the whole
 * quote with the others a click away inside it.
 *
 * Progressive enhancement. The cards ship with their quotes in full and the
 * openers hidden; this shortens the cards and turns them into openers. A blocked
 * script leaves a readable wall rather than a grid of truncated quotes nobody
 * can expand.
 *
 * The dialog is a native `<dialog>` opened with `showModal`, which brings the
 * focus trap, the backdrop and Escape-to-close with it rather than having them
 * reimplemented here badly.
 */
class RshTestimonialWall extends Component {
  #abort = null;
  #cards = [];
  #index = 0;
  #opener = null;

  connectedCallback() {
    super.connectedCallback();

    this.#cards = Array.from(this.querySelectorAll('[data-card]'));
    this.dialog = this.querySelector('[data-dialog]');
    if (!this.#cards.length || !this.dialog) return;

    this.#abort = new AbortController();
    const { signal } = this.#abort;

    this.dataset.enhanced = 'true';

    for (const card of this.#cards) {
      const index = Number(card.dataset.index);
      const opener = card.querySelector('[data-open]');
      if (opener) opener.hidden = false;

      card.addEventListener('click', (event) => {
        // A link inside a quote keeps its own behaviour.
        if (event.target.closest('a')) return;
        this.#open(index, opener ?? card);
      }, { signal });

      // The card is not a button, so give it the keyboard behaviour of one.
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        this.#open(index, opener ?? card);
      }, { signal });
    }

    this.querySelector('[data-close]')?.addEventListener('click', () => this.#close(), { signal });
    this.querySelector('[data-prev]')?.addEventListener('click', () => this.#step(-1), { signal });
    this.querySelector('[data-next]')?.addEventListener('click', () => this.#step(1), { signal });

    this.dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') this.#step(-1);
      if (event.key === 'ArrowRight') this.#step(1);
    }, { signal });

    // Clicking the backdrop. A click on the sheet stops here first.
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.#close();
    }, { signal });

    this.dialog.addEventListener('close', () => {
      unlockScroll(this.dialog);
      this.#opener?.focus();
      this.#opener = null;
    }, { signal });

    this.#watchReveal(signal);
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    if (this.dialog?.open) this.dialog.close();
    this.#abort?.abort();
    this.#abort = null;
  }

  /** Fades the cards in as they arrive, once each, and never under reduced motion. */
  #watchReveal(signal) {
    if (this.dataset.reveal !== 'true') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    this.dataset.reveal = 'armed';

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -10% 0px' });

    for (const card of this.#cards) observer.observe(card);
    signal.addEventListener('abort', () => observer.disconnect());
  }

  #open(index, opener) {
    this.#opener = opener;
    this.#render(index);
    this.dialog.showModal();
    lockScroll(this.dialog);
  }

  #close() {
    if (this.dialog.open) this.dialog.close();
  }

  #step(delta) {
    this.#render(this.#index + delta);
  }

  #render(index) {
    const total = this.#cards.length;
    this.#index = ((index % total) + total) % total;
    const card = this.#cards[this.#index];

    const move = (from, to) => {
      const source = card.querySelector(from);
      const target = this.querySelector(to);
      if (!target) return;
      target.innerHTML = source ? source.innerHTML : '';
      target.hidden = !source;
    };

    move('[data-headline]', '[data-d-headline]');
    move('[data-quote]', '[data-d-quote]');
    move('[data-name]', '[data-d-name]');
    move('[data-role]', '[data-d-role]');

    const counter = this.querySelector('[data-counter]');
    if (counter) counter.textContent = `${this.#index + 1} of ${total}`;

    // One quote is not worth paging through.
    for (const control of this.querySelectorAll('[data-prev], [data-next]')) {
      control.hidden = total < 2;
    }
    const nav = this.querySelector('.rsh-wall__sheet-nav');
    if (nav) nav.hidden = total < 2;
  }
}

if (!customElements.get('rsh-testimonial-wall')) {
  customElements.define('rsh-testimonial-wall', RshTestimonialWall);
}
