// StatAtlas dataset: national statistics for 32 countries.
//
// Figures are real published statistics, rounded for display. Each measure
// below names its source and reference year; the Sources page lists them
// again with notes on rounding. Compiled from the World Bank's World
// Development Indicators, the UNDP Human Development Report, UNESCO's
// Institute for Statistics, and the Global Carbon Budget (via Our World
// in Data). Latest available values at the time of writing, mostly 2023-2024.
//
// One object per country, in alphabetical order by name. Fields:
//   name, code, region, income group,
//   pop (millions), gdp (US$ billions, current), gdppc (US$),
//   life (years), literacy (adult %, 15+), unemp (% of labour force),
//   co2 (tonnes per person), internet (% of population),
//   hdi (Human Development Index, 0-1)

export const MEASURES = [
  { label: 'Population', key: 'pop', unit: 'million people', decimals: 1, year: 2024,
    source: 'World Bank, World Development Indicators',
    blurb: 'Mid-year population, all residents regardless of citizenship.' },
  { label: 'GDP', key: 'gdp', unit: 'US$ billion', decimals: 0, year: 2024,
    source: 'World Bank, World Development Indicators',
    blurb: 'Gross domestic product at current market prices, in US dollars.' },
  { label: 'GDP per capita', key: 'gdppc', unit: 'US$', decimals: 0, year: 2024,
    source: 'World Bank, World Development Indicators',
    blurb: 'GDP divided by mid-year population: the average output per person.' },
  { label: 'Life expectancy', key: 'life', unit: 'years', decimals: 1, year: 2023,
    source: 'World Bank, World Development Indicators',
    blurb: 'Years a newborn would live if current mortality rates stayed the same.' },
  { label: 'Adult literacy', key: 'literacy', unit: '% of adults', decimals: 1, year: 2023,
    source: 'UNESCO Institute for Statistics',
    blurb: 'Share of people aged 15 and over who can read and write a short, simple statement.' },
  { label: 'Unemployment', key: 'unemp', unit: '% of labour force', decimals: 1, year: 2024,
    source: 'World Bank / ILO modelled estimates',
    blurb: 'Share of the labour force without work but available for and seeking employment.' },
  { label: 'CO2 per capita', key: 'co2', unit: 'tonnes per person', decimals: 1, year: 2023,
    source: 'Global Carbon Budget, via Our World in Data',
    blurb: 'Carbon dioxide emissions from fossil fuels and industry, per person.' },
  { label: 'Internet users', key: 'internet', unit: '% of population', decimals: 0, year: 2023,
    source: 'ITU / World Bank, World Development Indicators',
    blurb: 'Share of the population that used the internet in the last three months.' },
  { label: 'Human Development Index', key: 'hdi', unit: '0 to 1', decimals: 3, year: 2023,
    source: 'UNDP, Human Development Report 2025',
    blurb: 'A composite of health, education and income, from 0 (lowest) to 1 (highest).' },
];

export const COUNTRIES = [
  { name: 'Argentina', code: 'ARG', region: 'South America', income: 'Upper middle', pop: 45.7, gdp: 604, gdppc: 13217, life: 77.7, literacy: 99.0, unemp: 6.4, co2: 3.9, internet: 89, hdi: 0.849 },
  { name: 'Australia', code: 'AUS', region: 'Oceania', income: 'High', pop: 26.7, gdp: 1775, gdppc: 66494, life: 83.7, literacy: 99.0, unemp: 4.0, co2: 14.9, internet: 96, hdi: 0.946 },
  { name: 'Brazil', code: 'BRA', region: 'South America', income: 'Upper middle', pop: 216.4, gdp: 2171, gdppc: 10032, life: 75.9, literacy: 93.5, unemp: 6.8, co2: 2.2, internet: 84, hdi: 0.760 },
  { name: 'Canada', code: 'CAN', region: 'North America', income: 'High', pop: 39.9, gdp: 2172, gdppc: 54455, life: 81.6, literacy: 99.0, unemp: 6.4, co2: 14.3, internet: 94, hdi: 0.935 },
  { name: 'China', code: 'CHN', region: 'Asia', income: 'Upper middle', pop: 1411.7, gdp: 18748, gdppc: 13281, life: 78.9, literacy: 97.1, unemp: 5.1, co2: 8.0, internet: 76, hdi: 0.788 },
  { name: 'Egypt', code: 'EGY', region: 'Africa', income: 'Lower middle', pop: 112.7, gdp: 384, gdppc: 3410, life: 70.2, literacy: 72.1, unemp: 7.2, co2: 2.1, internet: 72, hdi: 0.754 },
  { name: 'France', code: 'FRA', region: 'Europe', income: 'High', pop: 68.2, gdp: 3051, gdppc: 44746, life: 83.3, literacy: 99.0, unemp: 7.4, co2: 4.2, internet: 94, hdi: 0.920 },
  { name: 'Germany', code: 'DEU', region: 'Europe', income: 'High', pop: 84.7, gdp: 4626, gdppc: 54624, life: 80.9, literacy: 99.0, unemp: 3.5, co2: 6.8, internet: 93, hdi: 0.950 },
  { name: 'India', code: 'IND', region: 'Asia', income: 'Lower middle', pop: 1450.9, gdp: 3889, gdppc: 2681, life: 67.7, literacy: 76.3, unemp: 4.7, co2: 2.1, internet: 46, hdi: 0.685 },
  { name: 'Indonesia', code: 'IDN', region: 'Asia', income: 'Upper middle', pop: 283.5, gdp: 1396, gdppc: 4926, life: 68.4, literacy: 96.0, unemp: 4.9, co2: 2.3, internet: 67, hdi: 0.728 },
  { name: 'Italy', code: 'ITA', region: 'Europe', income: 'High', pop: 59.0, gdp: 2300, gdppc: 38986, life: 83.4, literacy: 99.2, unemp: 6.6, co2: 5.2, internet: 92, hdi: 0.915 },
  { name: 'Japan', code: 'JPN', region: 'Asia', income: 'High', pop: 124.5, gdp: 4026, gdppc: 32333, life: 84.0, literacy: 99.0, unemp: 2.5, co2: 8.4, internet: 83, hdi: 0.925 },
  { name: 'Kenya', code: 'KEN', region: 'Africa', income: 'Lower middle', pop: 55.3, gdp: 124, gdppc: 2242, life: 62.4, literacy: 82.6, unemp: 5.6, co2: 0.3, internet: 41, hdi: 0.601 },
  { name: 'Malaysia', code: 'MYS', region: 'Asia', income: 'Upper middle', pop: 34.1, gdp: 439, gdppc: 12874, life: 76.5, literacy: 95.5, unemp: 3.2, co2: 7.5, internet: 97, hdi: 0.807 },
  { name: 'Mexico', code: 'MEX', region: 'North America', income: 'Upper middle', pop: 130.9, gdp: 1789, gdppc: 13668, life: 75.4, literacy: 95.3, unemp: 2.7, co2: 3.6, internet: 81, hdi: 0.789 },
  { name: 'Netherlands', code: 'NLD', region: 'Europe', income: 'High', pop: 18.0, gdp: 1168, gdppc: 65009, life: 81.9, literacy: 99.0, unemp: 3.9, co2: 7.5, internet: 97, hdi: 0.955 },
  { name: 'New Zealand', code: 'NZL', region: 'Oceania', income: 'High', pop: 5.3, gdp: 257, gdppc: 48358, life: 82.5, literacy: 99.0, unemp: 4.6, co2: 6.4, internet: 95, hdi: 0.938 },
  { name: 'Nigeria', code: 'NGA', region: 'Africa', income: 'Lower middle', pop: 232.7, gdp: 187, gdppc: 805, life: 54.6, literacy: 62.0, unemp: 4.3, co2: 0.7, internet: 35, hdi: 0.560 },
  { name: 'Norway', code: 'NOR', region: 'Europe', income: 'High', pop: 5.6, gdp: 596, gdppc: 107645, life: 83.0, literacy: 99.0, unemp: 4.1, co2: 7.0, internet: 99, hdi: 0.970 },
  { name: 'Philippines', code: 'PHL', region: 'Asia', income: 'Lower middle', pop: 115.8, gdp: 437, gdppc: 3773, life: 72.3, literacy: 97.1, unemp: 3.8, co2: 1.5, internet: 72, hdi: 0.720 },
  { name: 'Poland', code: 'POL', region: 'Europe', income: 'High', pop: 36.7, gdp: 914, gdppc: 24810, life: 78.7, literacy: 99.7, unemp: 2.9, co2: 6.6, internet: 90, hdi: 0.881 },
  { name: 'Saudi Arabia', code: 'SAU', region: 'Asia', income: 'High', pop: 33.9, gdp: 1078, gdppc: 31822, life: 78.9, literacy: 96.1, unemp: 4.8, co2: 16.5, internet: 100, hdi: 0.900 },
  { name: 'Singapore', code: 'SGP', region: 'Asia', income: 'High', pop: 6.0, gdp: 547, gdppc: 91227, life: 84.1, literacy: 97.6, unemp: 2.7, co2: 7.7, internet: 96, hdi: 0.939 },
  { name: 'South Africa', code: 'ZAF', region: 'Africa', income: 'Upper middle', pop: 63.0, gdp: 400, gdppc: 6352, life: 63.9, literacy: 95.0, unemp: 32.9, co2: 7.0, internet: 75, hdi: 0.717 },
  { name: 'South Korea', code: 'KOR', region: 'Asia', income: 'High', pop: 51.7, gdp: 1713, gdppc: 33133, life: 83.4, literacy: 99.0, unemp: 2.8, co2: 10.9, internet: 97, hdi: 0.920 },
  { name: 'Spain', code: 'ESP', region: 'Europe', income: 'High', pop: 48.6, gdp: 1647, gdppc: 33893, life: 84.0, literacy: 98.4, unemp: 11.3, co2: 4.9, internet: 94, hdi: 0.918 },
  { name: 'Sweden', code: 'SWE', region: 'Europe', income: 'High', pop: 10.6, gdp: 584, gdppc: 55148, life: 83.4, literacy: 99.0, unemp: 8.4, co2: 3.4, internet: 96, hdi: 0.959 },
  { name: 'Thailand', code: 'THA', region: 'Asia', income: 'Upper middle', pop: 71.7, gdp: 526, gdppc: 7346, life: 76.4, literacy: 94.0, unemp: 1.1, co2: 3.8, internet: 88, hdi: 0.803 },
  { name: 'Turkey', code: 'TUR', region: 'Asia', income: 'Upper middle', pop: 85.5, gdp: 1333, gdppc: 15580, life: 77.2, literacy: 96.7, unemp: 8.7, co2: 5.0, internet: 86, hdi: 0.855 },
  { name: 'United Kingdom', code: 'GBR', region: 'Europe', income: 'High', pop: 69.1, gdp: 3565, gdppc: 51586, life: 79.1, literacy: 99.0, unemp: 4.3, co2: 4.9, internet: 97, hdi: 0.946 },
  { name: 'United States', code: 'USA', region: 'North America', income: 'High', pop: 340.1, gdp: 29185, gdppc: 85809, life: 78.4, literacy: 99.0, unemp: 4.0, co2: 13.8, internet: 92, hdi: 0.938 },
  { name: 'Vietnam', code: 'VNM', region: 'Asia', income: 'Lower middle', pop: 100.8, gdp: 476, gdppc: 4724, life: 74.6, literacy: 95.8, unemp: 2.2, co2: 3.4, internet: 78, hdi: 0.726 },
];

// The working list, sorted the way the dataset ships it (alphabetical).
export const countries = COUNTRIES;

export function findCountry(code) {
  return countries.find((c) => c.code === String(code || '').toUpperCase()) || null;
}

export function measureDef(key) {
  return MEASURES.find((m) => m.key === key) || null;
}

export function fmtValue(key, value) {
  const def = measureDef(key);
  const places = def ? def.decimals : 1;
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: places, maximumFractionDigits: places });
}

export function fmtBig(value) {
  if (value >= 1000) return (value / 1000).toFixed(2).replace(/\.?0+$/, '') + ' trillion';
  return Number(value).toLocaleString('en-US');
}

// Combined figures for the home page's world-at-a-glance strip.
export function worldTotals() {
  const pop = countries.reduce((sum, c) => sum + c.pop, 0);
  const gdp = countries.reduce((sum, c) => sum + c.gdp, 0);
  return { count: countries.length, popMillions: pop, gdpBillions: gdp };
}

// A country's place on one measure (1 = highest value). Ties share a place.
export function placeOf(code, key) {
  const ordered = [...countries].sort((a, b) => b[key] - a[key]);
  return ordered.findIndex((c) => c.code === code) + 1;
}

// The n highest countries on one measure, highest first.
export function leaders(key, n) {
  return [...countries].sort((a, b) => b[key] - a[key]).slice(0, n);
}

// The n lowest countries on one measure, lowest first.
export function trailers(key, n) {
  return [...countries].sort((a, b) => a[key] - b[key]).slice(0, n);
}

// Median of one measure across every country in the set.
export function medianValue(key) {
  const values = countries.map((c) => c[key]).sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  return values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
}

export const REGION_NAMES = [...new Set(countries.map((c) => c.region))].sort();
