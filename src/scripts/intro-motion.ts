/** Optional artwork enhancement. Content and navigation never wait for an image or animation. */
export function initializeIntroMotion() {
  const root = document.documentElement;
  const world = document.querySelector<HTMLElement>('.world-intro');
  const scene = world?.querySelector<HTMLElement>('.world-scene') ?? world;
  const button = document.querySelector<HTMLButtonElement>('[data-motion-toggle]');
  const label = button?.querySelector<HTMLElement>('[data-motion-label]');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'detailoop-motion-paused';
  let userPaused = false;
  const initialBounds = scene?.getBoundingClientRect();
  let visible = !initialBounds || (initialBounds.bottom > 0 && initialBounds.top < window.innerHeight);
  let pageActive = true;
  let artworkReady = false;
  let entranceSettled = false;
  let entranceTimer: number | undefined;

  // A blocked/full storage area must not prevent the page or its controls from working.
  try { userPaused = window.sessionStorage.getItem(storageKey) === 'true'; } catch { /* In-memory fallback. */ }

  function motionAllowed() {
    return pageActive && visible && !document.hidden && !userPaused && !preference.matches;
  }

  function settleEntrance() {
    if (entranceSettled) return;
    entranceSettled = true;
    if (entranceTimer !== undefined) window.clearTimeout(entranceTimer);
    world?.classList.remove('intro-entering');
    world?.classList.add('intro-settled');
  }

  function updateVisibility() {
    const paused = !motionAllowed();
    world?.classList.toggle('motion-paused', paused);
    // An interrupted entrance settles immediately; returning never hides or replays text.
    if (paused) settleEntrance();
  }

  function updatePreference() {
    root.dataset.motionPaused = String(userPaused || preference.matches);
    if (button) {
      button.hidden = preference.matches;
      button.disabled = preference.matches;
      button.setAttribute('aria-pressed', String(userPaused));
      if (label) label.textContent = (userPaused ? button.dataset.labelPlay : button.dataset.labelPause) ?? '';
    }
    updateVisibility();
    document.dispatchEvent(new Event('detailoop:motionchange'));
  }

  button?.addEventListener('click', () => {
    // OS reduction is authoritative even if a click was queued before it changed.
    if (preference.matches) return;
    userPaused = !userPaused;
    try { window.sessionStorage.setItem(storageKey, String(userPaused)); } catch { /* In-memory fallback. */ }
    updatePreference();
  });
  preference.addEventListener('change', updatePreference);

  if (scene && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === scene) visible = entry.isIntersecting;
      }
      updateVisibility();
    }, { threshold: 0 }).observe(scene);
  }
  document.addEventListener('visibilitychange', updateVisibility);
  window.addEventListener('pagehide', () => { pageActive = false; updateVisibility(); });
  window.addEventListener('pageshow', () => { pageActive = true; updateVisibility(); });

  const artwork = world?.querySelector<HTMLImageElement>('[data-intro-image]');
  const ready = () => {
    // Both load/error and responsive source changes may fire; the entrance belongs to this visit.
    if (artworkReady) return;
    artworkReady = true;
    world?.classList.add('intro-ready');
    if (!world || entranceSettled || !motionAllowed()) {
      settleEntrance();
      return;
    }
    world.classList.add('intro-entering');
    entranceTimer = window.setTimeout(settleEntrance, 2600);
  };
  if (artwork && !artwork.complete) {
    artwork.addEventListener('load', ready, { once: true });
    artwork.addEventListener('error', ready, { once: true });
  } else {
    ready();
  }
  updatePreference();
}
