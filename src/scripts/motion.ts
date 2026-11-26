import { initializeCtaMotion } from './cta-motion';
import { initializeIntroMotion } from './intro-motion';

// Restore a tab's preference before initializing any optional page motion.
initializeIntroMotion();

// Enhancement only: all copy is visible in the generated HTML without JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver: IntersectionObserver | undefined;

function revealAll() {
  revealObserver?.disconnect();
  document.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
}

function initializeMotion() {
  revealAll();
  if (reducedMotion.matches || document.documentElement.dataset.motionPaused === 'true' || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        revealObserver?.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 40px 0px' });

  const targets = document.querySelectorAll<HTMLElement>(
    '.home-philosophy .section-heading, .philosophy-highlights article, .home-game-row, .studio-intro-copy, .studio-intro .logo-panel, .news-teaser, .game-features article, .screens figure, .principle, .founder-profile'
  );
  targets.forEach(el => {
    if (el.getBoundingClientRect().top > window.innerHeight + 40) {
      el.classList.add('reveal-pending');
      revealObserver?.observe(el);
    }
  });
}

document.addEventListener('detailoop:motionchange', initializeMotion);
document.addEventListener('focusin', event => {
  if (event.target instanceof Element) event.target.closest('.reveal-pending')?.classList.remove('reveal-pending');
});
window.addEventListener('beforeprint', revealAll);
window.addEventListener('pageshow', event => { if (event.persisted) revealAll(); });
reducedMotion.addEventListener('change', initializeMotion);
initializeMotion();
initializeCtaMotion();
