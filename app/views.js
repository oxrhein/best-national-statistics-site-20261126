// StatAtlas views: one render function per page. Each returns an HTML
// string for #app; main.js swaps it in on every hash change. All figures
// come from data.js; every number shown names its source and year on the page.

import { MEASURES, REGION_NAMES, countries, findCountry, fmtBig, fmtValue, leaders, measureDef, medianValue, placeOf, trailers, worldTotals } from './data.js';
import { groupedBarChart, horizontalBars, medianCompareBars } from './charts.js';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function countryAnchor(code, name) {
  return `<a href="#/country/${code}">${escapeHtml(name)}</a>`;
}

function pageHeader(title, intro) {
  return `<div class="page-head"><h1>${escapeHtml(title)}</h1><p>${intro}</p></div>`;
}

function statCard(big, label, sub) {
  return `<div class="stat-card"><div class="big">${big}</div><div class="label">${label}</div><div class="sub">${sub}</div></div>`;
}

function countryCard(c, extra = '') {
  return `<a class="country-card" href="#/country/${c.code}">
      <span class="code">${c.code}</span>
      <h3>${escapeHtml(c.name)}</h3>
      <div class="meta">${escapeHtml(c.region)} · ${escapeHtml(c.income)} income</div>
      <div class="figure">Population <b>${fmtValue('pop', c.pop)}m</b></div>
      <div class="figure">GDP per capita <b>$${fmtValue('gdppc', c.gdppc)}</b></div>
      <div class="figure">Life expectancy <b>${fmtValue('life', c.life)} yrs</b></div>${extra}
    </a>`;
}

// ---------- home ----------

export function renderHome() {
  const t = worldTotals();
  const byPop = leaders('pop', 8).map((c) => ({
    label: c.name, value: c.pop, href: `#/country/${c.code}`, highlight: c.code === 'IDN',
  }));
  const byWealth = leaders('gdppc', 8).map((c) => ({
    label: c.name, value: c.gdppc, href: `#/country/${c.code}`,
  }));
  const featured = ['IDN', 'NOR', 'IND', 'USA'].map((code) => findCountry(code));
  const featuredHtml = featured.map((c) => countryCard(c)).join('');
  return `
  <section class="hero">
    <h1>Every country's numbers, <em>clearly.</em></h1>
    <p>StatAtlas gathers population, economy, health, education and climate
    figures for 32 countries — each one sourced and dated — so you can look a
    country up, compare it with its neighbours, and see where it stands.</p>
    <form class="hero-search" id="hero-search">
      <input type="search" id="hero-q" placeholder="Search a country — try Indonesia…" aria-label="Search countries" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <div class="hero-hint">Popular: <a href="#/country/IDN">Indonesia</a> ·
    <a href="#/country/JPN">Japan</a> · <a href="#/country/BRA">Brazil</a> ·
    <a href="#/compare">compare countries</a></div>
  </section>
  <div class="stat-strip">
    ${statCard(t.count, 'countries covered', 'Across 6 regions, 3 income groups')}
    ${statCard((t.popMillions / 1000).toFixed(2) + ' bn', 'people in those countries', 'About two thirds of humanity')}
    ${statCard('$' + fmtBig(t.gdpBillions), 'combined GDP, 2024', 'World Bank, current US dollars')}
    ${statCard('9', 'indicators per country', 'Population to CO&#8322; per capita')}
  </div>
  <div class="grid-2">
    <section class="panel">
      <h2>Largest populations <a class="more" href="#/countries">All countries →</a></h2>
      <p class="section-note">Millions of people, 2024 · World Bank</p>
      ${horizontalBars(byPop, 'pop')}
    </section>
    <section class="panel">
      <h2>Richest per person <a class="more" href="#/indicators">Indicators →</a></h2>
      <p class="section-note">GDP per capita, US$, 2024 · World Bank</p>
      ${horizontalBars(byWealth, 'gdppc')}
    </section>
  </div>
  <h2>Featured countries</h2>
  <p class="section-note">Four very different economies, side by side.</p>
  <div class="country-cards">${featuredHtml}</div>
  <div class="note-box"><b>How to read this site:</b> every figure shows its source
  and year. Open any country for its full profile, use
  <a href="#/countries">Explore</a> to sort and filter the whole table, and
  <a href="#/compare">Compare</a> to put up to four countries head to head.</div>`;
}

// ---------- explore / countries table ----------

export function renderCountries(state) {
  const query = (state.q || '').toLowerCase();
  const region = state.region || 'All';
  const sortKey = state.sort || 'pop';
  const dir = state.dir === 'asc' ? 1 : -1;
  let list = countries.filter((c) => {
    if (region !== 'All' && c.region !== region) return false;
    if (query && !c.name.toLowerCase().includes(query) && c.code.toLowerCase() !== query) return false;
    return true;
  });
  list = [...list].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string') return av.localeCompare(bv) * dir;
    return (av - bv) * dir;
  });
  const chips = ['All', ...REGION_NAMES].map((r) =>
    `<button class="chip${r === region ? ' on' : ''}" data-region="${escapeHtml(r)}">${escapeHtml(r)}</button>`).join('');
  const columns = [
    ['code', 'Code'], ['name', 'Country'], ['pop', 'Population (m)'], ['gdp', 'GDP ($bn)'],
    ['gdppc', 'GDP / person ($)'], ['life', 'Life exp. (yrs)'], ['literacy', 'Literacy (%)'],
    ['unemp', 'Unempl. (%)'], ['co2', 'CO₂ / person (t)'], ['internet', 'Internet (%)'], ['hdi', 'HDI'],
  ];
  const headRow = columns.map(([key, label]) => {
    const arrow = key === sortKey ? (dir === 1 ? ' ▲' : ' ▼') : '';
    const nextDir = key === sortKey && dir === -1 ? 'asc' : 'desc';
    return `<th><a href="#/countries?sort=${key}&amp;dir=${nextDir}">${label}${arrow}</a></th>`;
  }).join('');
  const rows = list.map((c) => `<tr>
    <td>${c.code}</td>
    <td class="country-name">${countryAnchor(c.code, c.name)}</td>
    <td class="num">${fmtValue('pop', c.pop)}</td>
    <td class="num">${fmtValue('gdp', c.gdp)}</td>
    <td class="num">${fmtValue('gdppc', c.gdppc)}</td>
    <td class="num">${fmtValue('life', c.life)}</td>
    <td class="num">${fmtValue('literacy', c.literacy)}</td>
    <td class="num">${fmtValue('unemp', c.unemp)}</td>
    <td class="num">${fmtValue('co2', c.co2)}</td>
    <td class="num">${fmtValue('internet', c.internet)}</td>
    <td class="num">${fmtValue('hdi', c.hdi)}</td>
  </tr>`).join('');
  const sortOptions = columns.slice(2).map(([key, label]) =>
    `<option value="${key}"${key === sortKey ? ' selected' : ''}>Sort: ${label}</option>`).join('');
  return `
  ${pageHeader('Explore all countries', 'All 32 countries, nine indicators each. Click a column heading to sort, type to search, or filter by region. Click any country for its full profile.')}
  <div class="controls">
    <input type="search" id="explore-q" placeholder="Search countries…" value="${escapeHtml(state.q || '')}" aria-label="Search countries">
    <select id="explore-sort" aria-label="Sort by">
      ${sortOptions}
    </select>
  </div>
  <div class="chip-row" id="region-chips">${chips}</div>
  <p class="section-note" style="margin-top:12px">Showing <b>${list.length}</b> of ${countries.length} countries · Population, GDP and GDP per capita: World Bank 2024 · Life expectancy: 2023 · <a href="#/sources">Full sources →</a></p>
  <div class="table-wrap"><table class="data">
    <thead><tr>${headRow}</tr></thead>
    <tbody>${rows || `<tr><td colspan="11" class="empty">No countries match that search.</td></tr>`}</tbody>
  </table></div>`;
}

// ---------- country profile ----------

export function renderCountry(code) {
  const c = findCountry(code);
  if (!c) {
    return `${pageHeader('Country not found', 'That country code is not in StatAtlas yet.')}
    <p><a class="btn" href="#/countries">Browse all countries</a></p>`;
  }
  const keyStats = ['pop', 'gdppc', 'life', 'hdi'].map((key) => {
    const def = measureDef(key);
    return statCard(
      fmtValue(key, c[key]),
      `${escapeHtml(def.label)} · ${escapeHtml(def.unit)}`,
      `Rank ${placeOf(c.code, key)} of ${countries.length} · ${escapeHtml(def.source)}, ${def.year}`,
    );
  }).join('');
  const detailRows = MEASURES.map((def) => `<tr>
    <td style="text-align:left"><b>${escapeHtml(def.label)}</b><br><span style="color:var(--muted);font-size:13px">${escapeHtml(def.blurb)}</span></td>
    <td class="num"><b>${fmtValue(def.key, c[def.key])}</b> ${escapeHtml(def.unit)}</td>
    <td class="num"><span class="rank-badge">#${placeOf(c.code, def.key)}</span></td>
    <td style="text-align:left">${escapeHtml(def.source)}, ${def.year}</td>
  </tr>`).join('');
  const neighbours = countries
    .filter((o) => o.region === c.region && o.code !== c.code)
    .slice(0, 4)
    .map((o) => `<a class="country-card" href="#/country/${o.code}">
      <span class="code">${o.code}</span><h3>${escapeHtml(o.name)}</h3>
      <div class="figure">Population <b>${fmtValue('pop', o.pop)}m</b></div>
      <div class="figure">GDP per capita <b>$${fmtValue('gdppc', o.gdppc)}</b></div>
    </a>`).join('');
  return `
  <div class="country-head">
    <span class="code">${c.code}</span>
    <h1>${escapeHtml(c.name)}</h1>
    <div class="tags">${escapeHtml(c.region)} · ${escapeHtml(c.income)} income · ${countries.length}-country comparison set</div>
  </div>
  <div class="key-stats">${keyStats}</div>
  <h2>At a glance</h2>
  <div class="grid-2">
    <section class="panel"><h2>Life expectancy vs the median</h2>
      <p class="section-note">Years, 2023 · World Bank</p>${medianCompareBars(c, 'life')}</section>
    <section class="panel"><h2>CO&#8322; per person vs the median</h2>
      <p class="section-note">Tonnes per person, 2023 · Global Carbon Budget</p>${medianCompareBars(c, 'co2')}</section>
  </div>
  <h2>All indicators for ${escapeHtml(c.name)}</h2>
  <p class="section-note">Rank is out of the ${countries.length} countries in this site, highest value first.</p>
  <div class="table-wrap"><table class="data" style="min-width:640px">
    <thead><tr><th style="text-align:left">Indicator</th><th>Value</th><th>Rank</th><th style="text-align:left">Source, year</th></tr></thead>
    <tbody>${detailRows}</tbody>
  </table></div>
  <p style="margin-top:16px"><a class="btn btn-amber" href="#/compare?c=${c.code}">Compare ${escapeHtml(c.name)} with others →</a></p>
  <h2>Also in ${escapeHtml(c.region)}</h2>
  <div class="country-cards">${neighbours}</div>`;
}

// ---------- compare ----------

export function renderCompare(state) {
  const picked = (state.c || ['IDN', 'NOR', 'USA', 'IND']).slice(0, 4);
  while (picked.length < 2) picked.push(countries[picked.length].code);
  const selected = picked.map((code) => findCountry(code) || countries[0]);
  const palette = ['#0e7c7b', '#e8a317', '#c65d3a', '#4a6fa5'];
  const pickers = [0, 1, 2, 3].map((i) => `
    <div><label for="pick-${i}">Country ${i + 1}</label>
    <select id="pick-${i}" data-slot="${i}">
      ${countries.map((c) => `<option value="${c.code}"${selected[i] && selected[i].code === c.code ? ' selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
    </select></div>`).join('');
  const legend = selected.map((c, i) =>
    `<span><span class="swatch" style="background:${palette[i % 4]}"></span>${escapeHtml(c.name)}</span>`).join('');
  const rows = MEASURES.map((def) => {
    const cells = selected.map((c) => `<td class="num"><b>${fmtValue(def.key, c[def.key])}</b></td>`).join('');
    return `<tr><td style="text-align:left"><b>${escapeHtml(def.label)}</b> <span style="color:var(--muted)">(${escapeHtml(def.unit)}, ${def.year})</span></td>${cells}</tr>`;
  }).join('');
  const headCells = selected.map((c) => `<th>${escapeHtml(c.name)}</th>`).join('');
  return `
  ${pageHeader('Compare countries', 'Pick up to four countries and put them head to head. Bars are scaled to the largest value in each group, so countries of very different size can be compared.')}
  <div class="compare-pickers">${pickers}</div>
  <div class="legend">${legend}</div>
  <div class="table-wrap"><table class="data" style="min-width:560px">
    <thead><tr><th style="text-align:left">Indicator</th>${headCells}</tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <h2>Charts</h2>
  <div class="grid-2">
    <section class="panel"><h2>People &amp; money</h2>
      ${groupedBarChart(selected, ['pop', 'gdp', 'gdppc'])}</section>
    <section class="panel"><h2>Health, work &amp; climate</h2>
      ${groupedBarChart(selected, ['life', 'unemp', 'co2', 'internet'])}</section>
  </div>
  <p class="source-line">Sources: World Bank WDI 2023–2024, UNESCO UIS 2023, Global Carbon Budget 2023, UNDP HDR 2025. See <a href="#/sources">Sources &amp; method</a> for details.</p>`;
}

// ---------- indicators ----------

export function renderIndicators() {
  const cards = MEASURES.map((def) => {
    const top = leaders(def.key, 3);
    const bottom = trailers(def.key, 3);
    const topList = top.map((c) => `${escapeHtml(c.name)} ${fmtValue(def.key, c[def.key])}`).join(' · ');
    const bottomList = bottom.map((c) => `${escapeHtml(c.name)} ${fmtValue(def.key, c[def.key])}`).join(' · ');
    return `<article class="indicator-card">
      <h3>${escapeHtml(def.label)} <span class="unit">· ${escapeHtml(def.unit)}</span></h3>
      <p>${escapeHtml(def.blurb)}</p>
      <p><b>Source:</b> ${escapeHtml(def.source)}, ${def.year} · <b>Median:</b> ${fmtValue(def.key, medianValue(def.key))} ${escapeHtml(def.unit)}</p>
      <div class="tops"><b>Highest:</b> ${topList}</div>
      <div class="tops"><b>Lowest:</b> ${bottomList}</div>
    </article>`;
  }).join('');
  return `
  ${pageHeader('Indicators', 'Nine measures, each with its definition, its source and year, the median across all 32 countries, and the three highest and lowest countries.')}
  <div class="indicator-grid">${cards}</div>
  <div class="note-box"><b>Why these nine?</b> Together they answer the questions
  people actually ask about a country: how many people live there, how rich it
  is, how long people live, how many can read, how many have work, how much
  carbon each person emits, how many are online, and how developed it is overall.</div>`;
}

// ---------- sources ----------

export function renderSources() {
  const t = worldTotals();
  const sourceItems = MEASURES.map((def) =>
    `<li><b>${escapeHtml(def.label)}</b> — ${escapeHtml(def.source)}, ${def.year}<span>${escapeHtml(def.blurb)}</span></li>`).join('');
  return `
  ${pageHeader('Sources & method', 'Where every number comes from, how it was chosen, and how to cite this site.')}
  <h2>Data sources</h2>
  <ul class="source-list">${sourceItems}</ul>
  <h2>Method</h2>
  <p>StatAtlas covers ${t.count} countries chosen to span every region and
  income group, from Indonesia (283.5 million people) to Norway (5.6 million).
  Figures are the latest published values available in November 2026, mostly
  reference years 2023 and 2024. Values are rounded to the precision shown:
  populations to 0.1 million, GDP to whole billions, GDP per capita to whole
  dollars, HDI to three decimals. Ranks are computed within this site's
  ${t.count}-country set, highest value first — they are not world ranks.</p>
  <p>Where a publisher reports a value as an estimate (UNESCO literacy, ILO
  unemployment), this site says so on the indicator's card. Nothing on this
  site is fetched from the internet: every figure ships in the site's own
  files, so the pages work fully offline.</p>
  <div class="note-box"><b>How to cite:</b> “StatAtlas, National Statistics,
  November 2026. Figures: World Bank World Development Indicators (2023–2024),
  UNESCO Institute for Statistics (2023), Global Carbon Budget (2023),
  UNDP Human Development Report 2025.”</div>
  <h2>About StatAtlas</h2>
  <p>StatAtlas is an original, independent statistics explorer built for the
  make.fun “best national statistics site” bounty. It is not affiliated with
  the World Bank, the United Nations, UNESCO or any national statistics office,
  and it copies no other site's design, text or images.</p>
  <p><a class="btn" href="#/">Back to the home page →</a></p>`;
}
