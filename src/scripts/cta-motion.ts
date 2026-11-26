/** Continuous gentle pulses while visible; links remain usable without this enhancement. */
export function initializeCtaMotion() {
  const targets = document.querySelectorAll<HTMLElement>('[data-cta-attention]');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const items = Array.from(targets, element => ({
    element,
    visible: false,
  }));
  let pageActive = true;

  function update() {
    for (const item of items) {
      const running = pageActive && item.visible && !document.hidden && !preference.matches
        && document.documentElement?.dataset.motionPaused !== 'true';
      item.element.classList.toggle('cta-attention-playing', running);
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const item = items.find(candidate => candidate.element === entry.target);
      if (!item) continue;
      item.visible = entry.isIntersecting && entry.intersectionRatio >= 0.65;
    }
    update();
  }, { threshold: [0, 0.65], rootMargin: '-128px 0px -16px 0px' });

  for (const item of items) observer.observe(item.element);
  document.addEventListener('visibilitychange', update);
  document.addEventListener('detailoop:motionchange', update);
  preference.addEventListener('change', update);
  window.addEventListener('pagehide', () => { pageActive = false; update(); });
  window.addEventListener('pageshow', () => { pageActive = true; update(); });
}
