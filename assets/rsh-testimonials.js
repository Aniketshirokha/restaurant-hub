import { Component } from '@theme/component';

/**
 * Turns the stacked list of customer quotes into one quote at a time, with the
 * speakers along the bottom as the way through them.
 *
 * Progressive enhancement throughout. Without this script every quote is on the
 * page, stacked and readable, and the controls are hidden because they would do
 * nothing. Enhancing is what hides the other quotes, so the section can never
 * end up showing one quote and no way to reach the rest.
 *
 * The ARIA tab roles are applied here rather than in Liquid for the same
 * reason: `role="tabpanel"` on a panel nobody can switch to is a lie about the
 * markup.
 */
class RshTestimonials extends Component {
  #abort = null;
  #index = 0;
  #timer = null;
  #panels = [];
  #tabs = [];

  connectedCallback() {
    super.connectedCallback();

    this.#panels = Array.from(this.querySelectorAll('[data-quote-panel]'));
    this.#tabs = Array.from(this.querySelectorAll('[data-quote-tab]'));

    // One quote is not a carousel. Leave it stacked and leave the controls off.
    if (this.#panels.length < 2) return;

    this.#abort = new AbortController();
    const { signal } = this.#abort;

    this.dataset.enhanced = 'true';
    this.#applyRoles();

    for (const [index, tab] of this.#tabs.entries()) {
      tab.addEventListener('click', () => this.#select(index, { focus: false }), { signal });
    }

    const tablist = this.querySelector('[data-quote-tabs]');
    tablist?.addEventListener('keydown', (event) => this.#onKeydown(event), { signal });

    this.querySelector('[data-quote-prev]')?.addEventListener(
      'click',
      () => this.#step(-1),
      { signal }
    );
    this.querySelector('[data-quote-next]')?.addEventListener(
      'click',
      () => this.#step(1),
      { signal }
    );

    this.#watchSwipe(signal);

    // Anyone reading or tabbing through has taken over; stop moving under them.
    this.addEventListener('pointerenter', () => this.#stop(), { signal });
    this.addEventListener('pointerleave', () => this.#start(), { signal });
    this.addEventListener('focusin', () => this.#stop(), { signal });
    this.addEventListener('focusout', (event) => {
      if (!this.contains(event.relatedTarget)) this.#start();
    }, { signal });

    document.addEventListener('visibilitychange', () => {
      document.hidden ? this.#stop() : this.#start();
    }, { signal });

    // In the theme editor, picking a quote in the sidebar should bring that
    // quote up rather than leaving the merchant editing something hidden.
    document.addEventListener('shopify:block:select', (event) => {
      const panel = event.target?.closest?.('[data-quote-panel]');
      const index = this.#panels.indexOf(panel);
      if (index < 0) return;
      this.#stop();
      this.#select(index, { focus: false });
    }, { signal });

    this.#select(0, { focus: false });
    this.#start();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.#stop();
    this.#abort?.abort();
    this.#abort = null;
  }

  get #autoplay() {
    if (this.dataset.autoplay !== 'true') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  get #interval() {
    const value = Number.parseInt(this.dataset.interval ?? '', 10);
    return Number.isFinite(value) && value >= 2000 ? value : 7000;
  }

  #applyRoles() {
    const tablist = this.querySelector('[data-quote-tabs]');
    if (tablist) {
      tablist.hidden = false;
      tablist.setAttribute('role', 'tablist');
      tablist.setAttribute('aria-label', this.dataset.label || 'Customer quotes');
    }

    for (const [index, tab] of this.#tabs.entries()) {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', this.#panels[index]?.id ?? '');
    }

    for (const [index, panel] of this.#panels.entries()) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', this.#tabs[index]?.id ?? '');
    }

    for (const control of this.querySelectorAll('[data-quote-prev], [data-quote-next]')) {
      control.hidden = false;
    }
  }

  #select(index, { focus = true } = {}) {
    const total = this.#panels.length;
    this.#index = ((index % total) + total) % total;

    for (const [i, panel] of this.#panels.entries()) {
      const active = i === this.#index;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    }

    for (const [i, tab] of this.#tabs.entries()) {
      const active = i === this.#index;
      tab.setAttribute('aria-selected', String(active));
      // Roving tabindex: one stop for the whole set, arrows move within it.
      tab.tabIndex = active ? 0 : -1;
      tab.classList.toggle('is-active', active);
    }

    if (focus) this.#tabs[this.#index]?.focus();
    this.#restartProgress();
  }

  #step(delta) {
    this.#select(this.#index + delta, { focus: false });
    this.#start();
  }

  #onKeydown(event) {
    const keys = {
      ArrowRight: this.#index + 1,
      ArrowLeft: this.#index - 1,
      Home: 0,
      End: this.#panels.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    this.#select(keys[event.key]);
  }

  #watchSwipe(signal) {
    const viewport = this.querySelector('[data-quote-viewport]');
    if (!viewport) return;

    let startX = null;
    viewport.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      startX = event.clientX;
    }, { signal });

    viewport.addEventListener('pointerup', (event) => {
      if (startX == null) return;
      const delta = event.clientX - startX;
      startX = null;
      if (Math.abs(delta) > 40) this.#step(delta < 0 ? 1 : -1);
    }, { signal });

    viewport.addEventListener('pointercancel', () => { startX = null; }, { signal });
  }

  #restartProgress() {
    const bar = this.#tabs[this.#index]?.querySelector('[data-quote-progress]');
    if (!bar) return;

    for (const other of this.querySelectorAll('[data-quote-progress]')) {
      other.style.animation = 'none';
    }
    if (!this.#autoplay) return;

    // Reading offsetWidth forces the reflow that lets the animation restart.
    void bar.offsetWidth;
    bar.style.animation = `rsh-voices-progress ${this.#interval}ms linear forwards`;
  }

  #start() {
    this.#stop();
    if (!this.#autoplay) return;
    this.#timer = window.setInterval(() => {
      this.#select(this.#index + 1, { focus: false });
    }, this.#interval);
    this.#restartProgress();
  }

  #stop() {
    if (this.#timer == null) return;
    window.clearInterval(this.#timer);
    this.#timer = null;
    for (const bar of this.querySelectorAll('[data-quote-progress]')) {
      bar.style.animationPlayState = 'paused';
    }
  }
}

if (!customElements.get('rsh-testimonials')) {
  customElements.define('rsh-testimonials', RshTestimonials);
}
