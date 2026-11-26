// StatAtlas pages: every page is a function that returns the HTML for #app.
// main.js swaps the result in whenever the hash route changes. All figures
// come from data.js, and every number on a page names its source and year.

import { MEASURES, REGION_NAMES, countries, findCountry, fmtBig, fmtValue, leaders, measureDef, medianValue, placeOf, trailers, worldTotals } from './data.js';
import { groupedBarChart, horizontalBars, medianCompareBars } from './charts.js';

function quote(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function linkCountry(code, name) {
  return '<a href="#/country/' + code + '">' + quote(name) + '</a>';
}

function head(title, intro) {
  return '<div class="page-head"><h1>' + quote(title) + '</h1><p>' + intro + '</p></div>';
}

function bigStat(big, label, sub) {
  return '<div class="stat-card"><div class="big">' + big + '</div><div class="label">' + label + '</div><div class="sub">' + sub + '</div></div>';
}

function miniCard(c) {
  const bits = [];
  bits.push('<a class="country-card" href="#/country/' + c.code + '">');
  bits.push('<span class="code">' + c.code + '</span><h3>' + quote(c.name) + '</h3>');
  bits.push('<div class="meta">' + quote(c.region) + ' · ' + quote(c.income) + ' income</div>');
  bits.push('<div class="figure">Population <b>' + fmtValue('pop', c.pop) + 'm</b></div>');
  bits.push('<div class="figure">GDP per capita <b>$' + fmtValue('gdppc', c.gdppc) + '</b></div>');
  bits.push('<div class="figure">Life expectancy <b>' + fmtValue('life', c.life) + ' yrs</b></div>');
  bits.push('</a>');
  return bits.join('\n');
}

function panel(title, note, body, moreHref) {
  const more = moreHref ? ' <a class="more" href="' + moreHref + '">See all →</a>' : '';
  return '<section class="panel"><h2>' + title + more + '</h2><p class="section-note">' + note + '</p>' + body + '</section>';
}

// ---------- home ----------

export function renderHome() {
  const t = worldTotals();
  const byPop = leaders('pop', 8).map((c) => ({ label: c.name, value: c.pop, href: '#/country/' + c.code, highlight: c.code === 'IDN' }));
  const byWealth = leaders('gdppc', 8).map((c) => ({ label: c.name, value: c.gdppc, href: '#/country/' + c.code }));
  const featured = ['IDN', 'NOR', 'IND', 'USA'].map((code) => findCountry(code));
  const cards = featured.map((c) => miniCard(c)).join('\n');
  const strip = [
    bigStat(t.count, 'countries covered', 'Across 6 regions, 3 income groups'),
    bigStat((t.popMillions / 1000).toFixed(2) + ' bn', 'people in those countries', 'About two thirds of humanity'),
    bigStat('$' + fmtBig(t.gdpBillions), 'combined GDP, 2024', 'World Bank, current US dollars'),
    bigStat('9', 'indicators per country', 'Population to CO&#8322; per capita'),
  ].join('\n');
  const out = [];
  out.push('<section class="hero"><h1>Every country\'s numbers, <em>clearly.</em></h1>');
  out.push('<p>StatAtlas brings together population, economy, health, education and climate figures for 32 countries — each one sourced and dated — so you can look a country up, set it beside its neighbours, and see where it stands.</p>');
  out.push('<form class="hero-search" id="hero-search"><input type="search" id="hero-q" placeholder="Search a country — try Indonesia…" aria-label="Search countries" autocomplete="off"><button type="submit">Search</button></form>');
  out.push('<div class="hero-hint">Popular: <a href="#/country/IDN">Indonesia</a> · <a href="#/country/JPN">Japan</a> · <a href="#/country/BRA">Brazil</a> · <a href="#/compare">compare countries</a></div></section>');
  out.push('<div class="stat-strip">' + strip + '</div>');
  out.push('<div class="grid-2">');
  out.push(panel('Largest populations', 'Millions of people, 2024 · World Bank', horizontalBars(byPop, 'pop'), '#/countries'));
  out.push(panel('Richest per person', 'GDP per capita, US$, 2024 · World Bank', horizontalBars(byWealth, 'gdppc'), '#/indicators'));
  out.push('</div>');
  out.push('<h2>Featured countries</h2><p class="section-note">Four very different economies, side by side.</p>');
  out.push('<div class="country-cards">' + cards + '</div>');
  out.push('<div class="note-box"><b>How to read this site:</b> every figure shows its source and year. Open any country for its full profile, use <a href="#/countries">Explore</a> to sort and filter the whole table, and <a href="#/compare">Compare</a> to put up to four countries head to head.</div>');
  return out.join('\n');
}

// ---------- explore / countries table ----------

const COLUMNS = [
  ['code', 'Code'], ['name', 'Country'], ['pop', 'Population (m)'], ['gdp', 'GDP ($bn)'],
  ['gdppc', 'GDP / person ($)'], ['life', 'Life exp. (yrs)'], ['literacy', 'Literacy (%)'],
  ['unemp', 'Unempl. (%)'], ['co2', 'CO₂ / person (t)'], ['internet', 'Internet (%)'], ['hdi', 'HDI'],
];

export function renderCountries(state) {
  const query = (state.q || '').toLowerCase();
  const region = state.region || 'All';
  const sortKey = state.sort || 'pop';
  const dir = state.dir === 'asc' ? 1 : -1;
  let list = countries.filter((c) => {
    if (region !== 'All' && c.region !== region) return false;
    if (!query) return true;
    return c.name.toLowerCase().includes(query) || c.code.toLowerCase() === query;
  });
  list = [...list].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'string') return av.localeCompare(bv) * dir;
    return (av - bv) * dir;
  });
  const chips = ['All', ...REGION_NAMES].map((r) => '<button class="chip' + (r === region ? ' on' : '') + '" data-region="' + quote(r) + '">' + quote(r) + '</button>').join('');
  const headCells = COLUMNS.map(([key, label]) => {
    const arrow = key === sortKey ? (dir === 1 ? ' ▲' : ' ▼') : '';
    const nextDir = key === sortKey && dir === -1 ? 'asc' : 'desc';
    return '<th><a href="#/countries?sort=' + key + '&amp;dir=' + nextDir + '">' + label + arrow + '</a></th>';
  }).join('');
  const rows = [];
  for (const c of list) {
    rows.push('<tr><td>' + c.code + '</td><td class="country-name">' + linkCountry(c.code, c.name) + '</td>'
      + '<td class="num">' + fmtValue('pop', c.pop) + '</td>'
      + '<td class="num">' + fmtValue('gdp', c.gdp) + '</td>'
      + '<td class="num">' + fmtValue('gdppc', c.gdppc) + '</td>'
      + '<td class="num">' + fmtValue('life', c.life) + '</td>'
      + '<td class="num">' + fmtValue('literacy', c.literacy) + '</td>'
      + '<td class="num">' + fmtValue('unemp', c.unemp) + '</td>'
      + '<td class="num">' + fmtValue('co2', c.co2) + '</td>'
      + '<td class="num">' + fmtValue('internet', c.internet) + '</td>'
      + '<td class="num">' + fmtValue('hdi', c.hdi) + '</td></tr>');
  }
  const body = rows.length ? rows.join('\n') : '<tr><td colspan="11" class="empty">No countries match that search.</td></tr>';
  const sortOptions = COLUMNS.slice(2).map(([key, label]) => '<option value="' + key + '"' + (key === sortKey ? ' selected' : '') + '>Sort: ' + label + '</option>').join('');
  const out = [];
  out.push(head('Explore all countries', 'All 32 countries, nine indicators each. Click a column heading to sort, type to search, or filter by region. Click any country for its full profile.'));
  out.push('<div class="controls"><input type="search" id="explore-q" placeholder="Search countries…" value="' + quote(state.q || '') + '" aria-label="Search countries"><select id="explore-sort" aria-label="Sort by">' + sortOptions + '</select></div>');
  out.push('<div class="chip-row" id="region-chips">' + chips + '</div>');
  out.push('<p class="section-note" style="margin-top:12px">Showing <b>' + list.length + '</b> of ' + countries.length + ' countries · Population, GDP and GDP per capita: World Bank 2024 · Life expectancy: 2023 · <a href="#/sources">Full sources →</a></p>');
  out.push('<div class="table-wrap"><table class="data"><thead><tr>' + headCells + '</tr></thead><tbody>' + body + '</tbody></table></div>');
  return out.join('\n');
}

// ---------- country profile ----------

export function renderCountry(code) {
  const c = findCountry(code);
  if (!c) {
    return head('Country not found', 'That country code is not in StatAtlas yet.')
      + '\n<p><a class="btn" href="#/countries">Browse all countries</a></p>';
  }
  const keyStats = ['pop', 'gdppc', 'life', 'hdi'].map((key) => {
    const def = measureDef(key);
    return bigStat(fmtValue(key, c[key]), quote(def.label) + ' · ' + quote(def.unit),
      'Rank ' + placeOf(c.code, key) + ' of ' + countries.length + ' · ' + quote(def.source) + ', ' + def.year);
  }).join('\n');
  const detailRows = [];
  for (const def of MEASURES) {
    detailRows.push('<tr><td style="text-align:left"><b>' + quote(def.label) + '</b><br><span style="color:var(--muted);font-size:13px">' + quote(def.blurb) + '</span></td>'
      + '<td class="num"><b>' + fmtValue(def.key, c[def.key]) + '</b> ' + quote(def.unit) + '</td>'
      + '<td class="num"><span class="rank-badge">#' + placeOf(c.code, def.key) + '</span></td>'
      + '<td style="text-align:left">' + quote(def.source) + ', ' + def.year + '</td></tr>');
  }
  const neighbours = countries
    .filter((o) => o.region === c.region && o.code !== c.code)
    .slice(0, 4)
    .map((o) => '<a class="country-card" href="#/country/' + o.code + '"><span class="code">' + o.code + '</span><h3>' + quote(o.name) + '</h3>'
      + '<div class="figure">Population <b>' + fmtValue('pop', o.pop) + 'm</b></div>'
      + '<div class="figure">GDP per capita <b>$' + fmtValue('gdppc', o.gdppc) + '</b></div></a>')
    .join('\n');
  const out = [];
  out.push('<div class="country-head"><span class="code">' + c.code + '</span><h1>' + quote(c.name) + '</h1>'
    + '<div class="tags">' + quote(c.region) + ' · ' + quote(c.income) + ' income · ' + countries.length + '-country comparison set</div></div>');
  out.push('<div class="key-stats">' + keyStats + '</div>');
  out.push('<h2>At a glance</h2><div class="grid-2">');
  out.push(panel('Life expectancy vs the median', 'Years, 2023 · World Bank', medianCompareBars(c, 'life')));
  out.push(panel('CO&#8322; per person vs the median', 'Tonnes per person, 2023 · Global Carbon Budget', medianCompareBars(c, 'co2')));
  out.push('</div>');
  out.push('<h2>All indicators for ' + quote(c.name) + '</h2>');
  out.push('<p class="section-note">Rank is out of the ' + countries.length + ' countries in this site, highest value first.</p>');
  out.push('<div class="table-wrap"><table class="data" style="min-width:640px"><thead><tr><th style="text-align:left">Indicator</th><th>Value</th><th>Rank</th><th style="text-align:left">Source, year</th></tr></thead><tbody>' + detailRows.join('\n') + '</tbody></table></div>');
  out.push('<p style="margin-top:16px"><a class="btn btn-amber" href="#/compare?c=' + c.code + '">Compare ' + quote(c.name) + ' with others →</a></p>');
  out.push('<h2>Also in ' + quote(c.region) + '</h2><div class="country-cards">' + neighbours + '</div>');
  return out.join('\n');
}

// ---------- compare ----------

export function renderCompare(state) {
  const picked = (state.c || ['IDN', 'NOR', 'USA', 'IND']).slice(0, 4);
  while (picked.length < 2) picked.push(countries[picked.length].code);
  const selected = picked.map((code) => findCountry(code) || countries[0]);
  const palette = ['#0e7c7b', '#e8a317', '#c65d3a', '#4a6fa5'];
  const pickers = [0, 1, 2, 3].map((i) => {
    const options = countries.map((c) => '<option value="' + c.code + '"' + (selected[i] && selected[i].code === c.code ? ' selected' : '') + '>' + quote(c.name) + '</option>').join('');
    return '<div><label for="pick-' + i + '">Country ' + (i + 1) + '</label><select id="pick-' + i + '" data-slot="' + i + '">' + options + '</select></div>';
  }).join('\n');
  const legend = selected.map((c, i) => '<span><span class="swatch" style="background:' + palette[i % 4] + '"></span>' + quote(c.name) + '</span>').join('');
  const rows = MEASURES.map((def) => {
    const cells = selected.map((c) => '<td class="num"><b>' + fmtValue(def.key, c[def.key]) + '</b></td>').join('');
    return '<tr><td style="text-align:left"><b>' + quote(def.label) + '</b> <span style="color:var(--muted)">(' + quote(def.unit) + ', ' + def.year + ')</span></td>' + cells + '</tr>';
  }).join('\n');
  const headCells = selected.map((c) => '<th>' + quote(c.name) + '</th>').join('');
  const out = [];
  out.push(head('Compare countries', 'Pick up to four countries and put them head to head. Bars are scaled to the largest value in each group, so countries of very different size can be compared.'));
  out.push('<div class="compare-pickers">' + pickers + '</div>');
  out.push('<div class="legend">' + legend + '</div>');
  out.push('<div class="table-wrap"><table class="data" style="min-width:560px"><thead><tr><th style="text-align:left">Indicator</th>' + headCells + '</tr></thead><tbody>' + rows + '</tbody></table></div>');
  out.push('<h2>Charts</h2><div class="grid-2">');
  out.push(panel('People &amp; money', 'Population, GDP and GDP per capita', groupedBarChart(selected, ['pop', 'gdp', 'gdppc'])));
  out.push(panel('Health, work &amp; climate', 'Life expectancy, unemployment, CO₂ and internet use', groupedBarChart(selected, ['life', 'unemp', 'co2', 'internet'])));
  out.push('</div>');
  out.push('<p class="source-line">Sources: World Bank WDI 2023–2024, UNESCO UIS 2023, Global Carbon Budget 2023, UNDP HDR 2025. See <a href="#/sources">Sources &amp; method</a> for details.</p>');
  return out.join('\n');
}

// ---------- indicators ----------

export function renderIndicators() {
  const cards = MEASURES.map((def) => {
    const top = leaders(def.key, 3);
    const bottom = trailers(def.key, 3);
    const topList = top.map((c) => quote(c.name) + ' ' + fmtValue(def.key, c[def.key])).join(' · ');
    const bottomList = bottom.map((c) => quote(c.name) + ' ' + fmtValue(def.key, c[def.key])).join(' · ');
    const lines = [];
    lines.push('<article class="indicator-card"><h3>' + quote(def.label) + ' <span class="unit">· ' + quote(def.unit) + '</span></h3>');
    lines.push('<p>' + quote(def.blurb) + '</p>');
    lines.push('<p><b>Source:</b> ' + quote(def.source) + ', ' + def.year + ' · <b>Median:</b> ' + fmtValue(def.key, medianValue(def.key)) + ' ' + quote(def.unit) + '</p>');
    lines.push('<div class="tops"><b>Highest:</b> ' + topList + '</div>');
    lines.push('<div class="tops"><b>Lowest:</b> ' + bottomList + '</div></article>');
    return lines.join('\n');
  }).join('\n');
  const out = [];
  out.push(head('Indicators', 'Nine measures, each with its definition, its source and year, the median across all 32 countries, and the three highest and lowest countries.'));
  out.push('<div class="indicator-grid">' + cards + '</div>');
  out.push('<div class="note-box"><b>Why these nine?</b> Together they answer the questions people actually ask about a country: how many people live there, how rich it is, how long people live, how many can read, how many have work, how much carbon each person emits, how many are online, and how developed it is overall.</div>');
  return out.join('\n');
}

// ---------- sources ----------

export function renderSources() {
  const t = worldTotals();
  const items = MEASURES.map((def) => '<li><b>' + quote(def.label) + '</b> — ' + quote(def.source) + ', ' + def.year + '<span>' + quote(def.blurb) + '</span></li>').join('\n');
  const out = [];
  out.push(head('Sources & method', 'Where every number comes from, how it was chosen, and how to cite this site.'));
  out.push('<h2>Data sources</h2><ul class="source-list">' + items + '</ul>');
  out.push('<h2>Method</h2>');
  out.push('<p>StatAtlas covers ' + t.count + ' countries chosen to span every region and income group, from Indonesia (283.5 million people) to Norway (5.6 million). Figures are the latest published values available in November 2026, mostly reference years 2023 and 2024. Values are rounded to the precision shown: populations to 0.1 million, GDP to whole billions, GDP per capita to whole dollars, HDI to three decimals. Ranks are computed within this site\'s ' + t.count + '-country set, highest value first — they are not world ranks.</p>');
  out.push('<p>Where a publisher reports a value as an estimate (UNESCO literacy, ILO unemployment), this site says so on the indicator\'s card. Nothing on this site is fetched from the internet: every figure ships in the site\'s own files, so the pages work fully offline.</p>');
  out.push('<div class="note-box"><b>How to cite:</b> “StatAtlas, National Statistics, November 2026. Figures: World Bank World Development Indicators (2023–2024), UNESCO Institute for Statistics (2023), Global Carbon Budget (2023), UNDP Human Development Report 2025.”</div>');
  out.push('<h2>About StatAtlas</h2>');
  out.push('<p>StatAtlas is an original, independent statistics explorer built for the make.fun “best national statistics site” bounty. It is not affiliated with the World Bank, the United Nations, UNESCO or any national statistics office, and it copies no other site\'s design, text or images.</p>');
  out.push('<p><a class="btn" href="#/">Back to the home page →</a></p>');
  return out.join('\n');
}
