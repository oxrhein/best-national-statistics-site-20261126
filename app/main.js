// StatAtlas router: hash routes, active nav, and wiring for the controls
// each page offers (search, region chips, sort, compare pickers).
// No network requests: every page renders from data.js.

import { findCountry } from './data.js';
import { renderCompare, renderCountries, renderCountry, renderHome, renderIndicators, renderSources } from './views.js';

const appRoot = document.getElementById('app');
const navAnchors = [...document.querySelectorAll('.main-nav a')];

function readRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart || '');
  return { segments, query };
}

function markNav(route) {
  navAnchors.forEach((a) => {
    const target = a.getAttribute('href').replace(/^#\/?/, '').split('?')[0];
    a.classList.toggle('active', target === route || (route === '' && target === ''));
  });
}

function renderPage() {
  const { segments, query } = readRoute();
  const route = segments[0] || '';
  let html;
  if (route === '') {
    html = renderHome();
  } else if (route === 'countries') {
    html = renderCountries({
      q: query.get('q') || '',
      region: query.get('region') || 'All',
      sort: query.get('sort') || 'pop',
      dir: query.get('dir') || 'desc',
    });
  } else if (route === 'country') {
    html = renderCountry(segments[1] || '');
  } else if (route === 'compare') {
    const picked = (query.get('c') || '').split(',').filter(Boolean);
    html = renderCompare({ c: picked.length ? picked : undefined });
  } else if (route === 'indicators') {
    html = renderIndicators();
  } else if (route === 'sources') {
    html = renderSources();
  } else {
    html = `<div class="page-head"><h1>Page not found</h1>
      <p>That page does not exist on StatAtlas.</p></div>
      <p><a class="btn" href="#/">Back to the home page</a></p>`;
  }
  appRoot.innerHTML = html;
  markNav(route);
  window.scrollTo(0, 0);
  bindControls(route, query);
}

function pushParams(params) {
  const current = readRoute();
  const next = new URLSearchParams(current.query);
  Object.entries(params).forEach(([key, value]) => {
    if (value) next.set(key, value); else next.delete(key);
  });
  const base = '/' + current.segments.join('/');
  location.hash = base + (next.toString() ? '?' + next.toString() : '');
}

function bindControls(route, query) {
  // Home search: jump to the explore page with the query applied.
  const heroForm = document.getElementById('hero-search');
  if (heroForm) {
    heroForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const q = document.getElementById('hero-q').value.trim();
      location.hash = '#/countries' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }
  if (route !== 'countries' && route !== 'compare') return;

  if (route === 'countries') {
    const searchBox = document.getElementById('explore-q');
    if (searchBox) {
      searchBox.addEventListener('input', () => {
        clearTimeout(searchBox._timer);
        searchBox._timer = setTimeout(() => pushParams({ q: searchBox.value.trim() }), 350);
      });
    }
    const sortSelect = document.getElementById('explore-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => pushParams({ sort: sortSelect.value, dir: 'desc' }));
    }
    document.querySelectorAll('#region-chips .chip').forEach((chip) => {
      chip.addEventListener('click', () => pushParams({ region: chip.dataset.region }));
    });
  }

  if (route === 'compare') {
    document.querySelectorAll('.compare-pickers select').forEach((select) => {
      select.addEventListener('change', () => {
        const codes = [0, 1, 2, 3]
          .map((i) => document.getElementById('pick-' + i).value)
          .filter((code, i, arr) => arr.indexOf(code) === i);
        location.hash = '#/compare?c=' + codes.join(',');
      });
    });
  }
}

// Keep the page title in step with the route.
function syncTitle() {
  const { segments } = readRoute();
  const route = segments[0] || '';
  const names = {
    '': 'StatAtlas — National Statistics, Clearly',
    countries: 'Explore Countries — StatAtlas',
    country: (findCountry(segments[1] || '') || { name: 'Country' }).name + ' — StatAtlas',
    compare: 'Compare Countries — StatAtlas',
    indicators: 'Indicators — StatAtlas',
    sources: 'Sources & Method — StatAtlas',
  };
  document.title = names[route] || 'StatAtlas — National Statistics, Clearly';
}

window.addEventListener('hashchange', () => { renderPage(); syncTitle(); });
renderPage();
syncTitle();
