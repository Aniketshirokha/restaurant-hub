/**
 * Fades a section's items in as it arrives, staggered, once. Any element with
 * `data-rsh-reveal` is a container; its `[data-rsh-reveal-item]` children get
 * an index the stylesheet turns into a delay. Nothing moves under reduced
 * motion, and a browser without IntersectionObserver simply shows everything,
 * because the styles that hide items only apply once the container is armed.
 */
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

function arm(root) {
  if (root.dataset.rshReveal === 'armed' || root.dataset.rshReveal === 'done') return;
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  const items = root.querySelectorAll('[data-rsh-reveal-item]');
  items.forEach((item, index) => item.style.setProperty('--rsh-reveal-i', index));
  root.dataset.rshReveal = 'armed';

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        root.classList.add('is-in');
        root.dataset.rshReveal = 'done';
        observer.disconnect();
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
  );
  observer.observe(root);
}

function armAll(scope = document) {
  scope.querySelectorAll('[data-rsh-reveal]').forEach(arm);
}

armAll();

// The theme editor swaps section markup in place; new markup needs arming too.
document.addEventListener('shopify:section:load', (event) => armAll(event.target));
