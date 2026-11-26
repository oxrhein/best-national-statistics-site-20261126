// StatAtlas charts: hand-rolled SVG bar charts, no library involved.
// Each chart is built from data.js and drawn as inline SVG, so it works
// offline and keeps the first load small. No canvas, no images.

import { fmtValue, measureDef, medianValue } from './data.js';

const TEAL = '#0e7c7b';
const AMBER = '#e8a317';
const GREY = '#9aa5ad';
const PALETTE = ['#0e7c7b', '#e8a317', '#c65d3a', '#4a6fa5'];

function xmlEscape(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function svgOpen(width, height, label) {
  return `<svg viewBox="0 0 ${width} ${height}" class="chart" role="img" aria-label="${xmlEscape(label)}">`;
}

// Horizontal bars: rows of { label, value, href?, highlight? }.
// `key` picks the measure so values print with the right decimals.
export function horizontalBars(rows, key, opts = {}) {
  const def = measureDef(key);
  const rowH = opts.rowHeight || 26;
  const rowGap = opts.rowGap || 10;
  const labelW = opts.labelWidth || 150;
  const width = opts.width || 720;
  const top = Math.max(...rows.map((r) => r.value), 0.0001);
  const height = rows.length * (rowH + rowGap) + 6;
  const barArea = width - labelW - 90;
  const groups = rows.map((row, i) => {
    const y = 3 + i * (rowH + rowGap);
    const w = Math.max(2, (barArea * row.value) / top);
    const fill = row.highlight ? AMBER : (opts.accent || TEAL);
    const label = xmlEscape(row.label);
    const value = xmlEscape(fmtValue(key, row.value));
    const textY = y + rowH / 2 + 5;
    const labelTag = row.href
      ? `<a href="${row.href}"><text x="0" y="${textY}" class="chart-label chart-link">${label}</text></a>`
      : `<text x="0" y="${textY}" class="chart-label">${label}</text>`;
    // The panel above the chart already names the unit, so the bar prints
    // the value alone: "1,450.9" rather than "1,450.9 million people",
    // which would run past the chart's edge on the longest bars.
    return `<g>\n      ${labelTag}\n      <rect x="${labelW}" y="${y}" width="${w}" height="${rowH}" rx="5" fill="${fill}"></rect>\n      <text x="${labelW + w + 8}" y="${textY}" class="chart-value">${value}</text>\n    </g>`;
  }).join('\n');
  const title = def ? def.label : key;
  return svgOpen(width, height, `Bar chart of ${title}`) + groups + '</svg>';
}

// Grouped bars for the compare page: one group per measure, one bar per
// country. Values are scaled to the largest in each group, so countries of
// very different size can be compared side by side.
export function groupedBarChart(countryList, keys, opts = {}) {
  const rowH = 30;
  const labelW = opts.labelWidth || 170;
  const width = opts.width || 720;
  const groupSpan = rowH * countryList.length + 34;
  const groups = keys.map((key, gi) => {
    const def = measureDef(key);
    const top = Math.max(...countryList.map((c) => c[key]), 0.0001);
    const y0 = gi * groupSpan + 22;
    const bars = countryList.map((c, ci) => {
      const y = y0 + ci * rowH;
      const w = Math.max(2, ((width - labelW - 110) * c[key]) / top);
      return `<g>\n        <text x="0" y="${y + 19}" class="chart-label">${xmlEscape(c.name)}</text>\n        <rect x="${labelW}" y="${y}" width="${w}" height="22" rx="4" fill="${PALETTE[ci % PALETTE.length]}"></rect>\n        <text x="${labelW + w + 8}" y="${y + 16}" class="chart-value">${xmlEscape(fmtValue(key, c[key]))}</text>\n      </g>`;
    }).join('\n');
    return `<text x="0" y="${y0 - 8}" class="chart-group">${xmlEscape(def.label)} (${xmlEscape(def.unit)})</text>\n${bars}`;
  }).join('\n');
  const height = keys.length * groupSpan + 6;
  return svgOpen(width, height, 'Country comparison chart') + groups + '</svg>';
}

// One country's value set against the median of all 32 countries:
// the country in amber, the median in grey.
export function medianCompareBars(country, key) {
  const def = measureDef(key);
  const median = medianValue(key);
  const top = Math.max(country[key], median, 0.0001);
  const width = 720;
  const labelW = 170;
  const rows = [
    { label: country.name, value: country[key], fill: AMBER },
    { label: 'Median of 32 countries', value: median, fill: GREY },
  ];
  const bars = rows.map((row, i) => {
    const y = 3 + i * 36;
    const w = Math.max(2, ((width - labelW - 110) * row.value) / top);
    return `<g>\n      <text x="0" y="${y + 19}" class="chart-label">${xmlEscape(row.label)}</text>\n      <rect x="${labelW}" y="${y}" width="${w}" height="24" rx="5" fill="${row.fill}"></rect>\n      <text x="${labelW + w + 8}" y="${y + 18}" class="chart-value">${xmlEscape(fmtValue(key, row.value))}</text>\n    </g>`;
  }).join('\n');
  const label = `${def.label}: ${country.name} against the median`;
  return `<svg viewBox="0 0 ${width} 78" class="chart chart-small" role="img" aria-label="${xmlEscape(label)}">${bars}</svg>`;
}
