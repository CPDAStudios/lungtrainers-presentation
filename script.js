const slides = [...document.querySelectorAll('[data-slide]')];
const previousButton = document.querySelector('.deck-prev');
const nextButton = document.querySelector('.deck-next');
const counter = document.querySelector('.deck-counter');
const title = document.querySelector('.deck-title');
const progress = document.querySelector('.deck-status b');
const indexOverlay = document.querySelector('.slide-index');
const indexPanel = document.querySelector('.index-panel');
const indexList = document.querySelector('.index-list');
const indexToggles = document.querySelectorAll('.index-toggle');
const indexClose = document.querySelector('.index-close');
const headerLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];

let currentSlide = 0;
let wheelLocked = false;
let touchStartY = null;

const pad = (number) => String(number).padStart(2, '0');

function slideForHash(hash) {
  if (!hash || hash === '#') return 0;
  const target = document.querySelector(hash);
  const slide = target?.closest('[data-slide]');
  const index = slides.indexOf(slide);
  return index >= 0 ? index : 0;
}

function setActiveSlide(index, options = {}) {
  const boundedIndex = Math.max(0, Math.min(index, slides.length - 1));
  currentSlide = boundedIndex;

  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === currentSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slide.inert = !active;
    if (active) slide.scrollTop = 0;
  });

  const activeSlide = slides[currentSlide];
  const activeTitle = activeSlide.dataset.title || `Pantalla ${currentSlide + 1}`;
  counter.textContent = `${pad(currentSlide + 1)} / ${pad(slides.length)}`;
  title.textContent = activeTitle;
  progress.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  previousButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;

  document.querySelectorAll('.index-item').forEach((item, itemIndex) => {
    item.classList.toggle('active', itemIndex === currentSlide);
    item.setAttribute('aria-current', itemIndex === currentSlide ? 'step' : 'false');
  });

  headerLinks.forEach((link) => {
    const targetSlide = document.querySelector(link.getAttribute('href'))?.closest('[data-slide]');
    link.classList.toggle('active', targetSlide === activeSlide);
  });

  if (options.updateHash !== false) {
    history.replaceState(null, '', `#${activeSlide.id}`);
  }
}

function openIndex() {
  indexOverlay.classList.add('open');
  indexOverlay.setAttribute('aria-hidden', 'false');
  indexToggles.forEach((button) => button.setAttribute('aria-expanded', 'true'));
  indexClose.focus();
}

function closeIndex() {
  indexOverlay.classList.remove('open');
  indexOverlay.setAttribute('aria-hidden', 'true');
  indexToggles.forEach((button) => button.setAttribute('aria-expanded', 'false'));
}

slides.forEach((slide, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'index-item';
  button.innerHTML = `<span>${pad(index + 1)}</span><strong>${slide.dataset.title}</strong>`;
  button.addEventListener('click', () => {
    setActiveSlide(index);
    closeIndex();
  });
  indexList.append(button);
});

previousButton.addEventListener('click', () => setActiveSlide(currentSlide - 1));
nextButton.addEventListener('click', () => setActiveSlide(currentSlide + 1));
indexToggles.forEach((button) => button.addEventListener('click', openIndex));
indexClose.addEventListener('click', closeIndex);
indexOverlay.addEventListener('click', (event) => {
  if (!indexPanel.contains(event.target)) closeIndex();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    const slide = target?.closest('[data-slide]');
    const index = slides.indexOf(slide);
    if (index < 0) return;
    event.preventDefault();
    setActiveSlide(index);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && indexOverlay.classList.contains('open')) {
    closeIndex();
    return;
  }
  if (indexOverlay.classList.contains('open')) return;

  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    setActiveSlide(currentSlide + 1);
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    setActiveSlide(currentSlide - 1);
  }
  if (event.key === 'Home') setActiveSlide(0);
  if (event.key === 'End') setActiveSlide(slides.length - 1);
});

document.addEventListener('wheel', (event) => {
  if (wheelLocked || indexOverlay.classList.contains('open') || Math.abs(event.deltaY) < 28) return;
  const activeSlide = slides[currentSlide];
  const canScrollDown = activeSlide.scrollTop + activeSlide.clientHeight < activeSlide.scrollHeight - 4;
  const canScrollUp = activeSlide.scrollTop > 4;

  if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) return;

  event.preventDefault();
  wheelLocked = true;
  setActiveSlide(currentSlide + (event.deltaY > 0 ? 1 : -1));
  window.setTimeout(() => { wheelLocked = false; }, 520);
}, { passive: false });

document.addEventListener('touchstart', (event) => {
  touchStartY = event.changedTouches[0]?.clientY ?? null;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  if (touchStartY === null || indexOverlay.classList.contains('open')) return;
  const endY = event.changedTouches[0]?.clientY ?? touchStartY;
  const distance = touchStartY - endY;
  touchStartY = null;
  if (Math.abs(distance) < 70) return;

  const activeSlide = slides[currentSlide];
  const canScrollDown = activeSlide.scrollTop + activeSlide.clientHeight < activeSlide.scrollHeight - 4;
  const canScrollUp = activeSlide.scrollTop > 4;
  if ((distance > 0 && canScrollDown) || (distance < 0 && canScrollUp)) return;

  setActiveSlide(currentSlide + (distance > 0 ? 1 : -1));
}, { passive: true });

window.addEventListener('hashchange', () => setActiveSlide(slideForHash(location.hash), { updateHash: false }));

setActiveSlide(slideForHash(location.hash), { updateHash: false });
