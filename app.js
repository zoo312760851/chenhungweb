
const root = document.documentElement;
const body = document.body;
const langToggle = document.getElementById('langToggle');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('siteHeader');
const cursor = document.querySelector('.ambient-cursor');

const readLanguage = () => {
  try { return localStorage.getItem('portfolio-language'); } catch { return null; }
};
const saveLanguage = (lang) => {
  try { localStorage.setItem('portfolio-language', lang); } catch {}
};
const syncVennLanguage = (lang) => {
  document.querySelectorAll('[data-venn-lang]').forEach(group => {
    const active = group.dataset.vennLang === lang;
    group.style.setProperty('display', active ? 'inline' : 'none', 'important');
    group.setAttribute('aria-hidden', String(!active));
  });
  document.querySelectorAll('[data-aria-zh][data-aria-en]').forEach(element => {
    element.setAttribute('aria-label', lang === 'zh' ? element.dataset.ariaZh : element.dataset.ariaEn);
  });
};
const setLanguage = (lang) => {
  root.dataset.lang = lang;
  root.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  if (langToggle) langToggle.textContent = lang === 'zh' ? 'EN' : '中';
  syncVennLanguage(lang);
  saveLanguage(lang);
};
const queryLanguage = new URLSearchParams(location.search).get('lang');
const initialLanguage = queryLanguage === 'en' || queryLanguage === 'zh'
  ? queryLanguage
  : (readLanguage() === 'en' ? 'en' : 'zh');
setLanguage(initialLanguage);
if (langToggle) langToggle.addEventListener('click', () => setLanguage(root.dataset.lang === 'zh' ? 'en' : 'zh'));

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 16);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.querySelectorAll('[data-page]').forEach(link => {
  if ((link.dataset.page || '').toLowerCase() === current) link.classList.add('active');
});

const revealPage = () => {
  body.classList.remove('is-loading');
  body.classList.add('is-ready');
};
requestAnimationFrame(() => requestAnimationFrame(revealPage));
window.addEventListener('load', revealPage, { once: true });
setTimeout(revealPage, 500);

if (cursor && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
}

const vennCircles = document.querySelectorAll('.venn-circle');
const domainCards = document.querySelectorAll('.domain-card');
const activateDomain = (domain) => {
  vennCircles.forEach(circle => circle.classList.toggle('active', circle.dataset.domain === domain));
  domainCards.forEach(card => card.classList.toggle('active', card.dataset.domain === domain));
};
vennCircles.forEach(circle => {
  circle.addEventListener('mouseenter', () => activateDomain(circle.dataset.domain));
  circle.addEventListener('focus', () => activateDomain(circle.dataset.domain));
  circle.addEventListener('mouseleave', () => activateDomain('center'));
});
domainCards.forEach(card => {
  card.addEventListener('mouseenter', () => activateDomain(card.dataset.domain));
  card.addEventListener('mouseleave', () => activateDomain('center'));
});
activateDomain('center');

document.getElementById('year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
