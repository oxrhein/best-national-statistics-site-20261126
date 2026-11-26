// StatAtlas router: hash routes, active nav, and wiring for the controls
// each page offers (search, region chips, sort, compare pickers).
// No network requests: every page renders from data.js.

import { findCountry } from './data.js';
import { renderCompare, renderCountries, renderCountry, renderHome, renderIndicators, renderSources } from './views.js';

const appRoot = document.getElementById('app');
const navAnchors = [...document.querySelectorAll('.main-nav a')];

// One entry per route: the key is the first hash segment, the value builds
// the page's HTML from the route's segments and query string.
const ROUTES = {
  '': () => renderHome(),
  countries: (_seg, q) => renderCountries({
    q: q.get('q') || '',
    region: q.get('region') || 'All',
    sort: q.get('sort') || 'pop',
    dir: q.get('dir') || 'desc',
  }),
  country: (seg) => renderCountry(seg[1] || ''),
  compare: (_seg, q) => {
    const picked = (q.get('c') || '').split(',').filter(Boolean);
    return renderCompare({ c: picked.length ? picked : undefined });
  },
  indicators: () => renderIndicators(),
  sources: () => renderSources(),
};

const TITLES = {
  '': 'StatAtlas — National Statistics, Clearly',
  countries: 'Explore Countries — StatAtlas',
  compare: 'Compare Countries — StatAtlas',
  indicators: 'Indicators — StatAtlas',
  sources: 'Sources & Method — StatAtlas',
};

function readRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  return { segments: pathPart.split('/').filter(Boolean), query: new URLSearchParams(queryPart || '') };
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
  const build = ROUTES[route];
  const html = build
    ? build(segments, query)
    : '<div class="page-head"><h1>Page not found</h1><p>That page does not exist on StatAtlas.</p></div><p><a class="btn" href="#/">Back to the home page</a></p>';
  appRoot.innerHTML = html;
  markNav(route);
  window.scrollTo(0, 0);
  bindControls(route, query);
  syncTitle(route, segments);
}

function pushParams(params) {
  const current = readRoute();
  const next = new URLSearchParams(current.query);
  for (const [key, value] of Object.entries(params)) {
    if (value) next.set(key, value); else next.delete(key);
  }
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
  if (route === 'countries') bindExploreControls();
  if (route === 'compare') bindCompareControls();
}

function bindExploreControls() {
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

function bindCompareControls() {
  document.querySelectorAll('.compare-pickers select').forEach((select) => {
    select.addEventListener('change', () => {
      const codes = [0, 1, 2, 3]
        .map((i) => document.getElementById('pick-' + i).value)
        .filter((code, i, arr) => arr.indexOf(code) === i);
      location.hash = '#/compare?c=' + codes.join(',');
    });
  });
}

// Keep the page title in step with the route.
function syncTitle(route, segments) {
  if (route === 'country') {
    const c = findCountry(segments[1] || '');
    document.title = (c ? c.name : 'Country') + ' — StatAtlas';
    return;
  }
  document.title = TITLES[route] || 'StatAtlas — National Statistics, Clearly';
}

window.addEventListener('hashchange', renderPage);
renderPage();
