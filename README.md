# StatAtlas — National Statistics, Clearly

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/oxrhein/best-national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/oxrhein/best-national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

**StatAtlas** is a national statistics site built for the make.fun bounty
**best-national-statistics-site-20261126-0539** ($50; entries close 29 Nov
2026, 12:39 WIB). It covers **32 countries** with nine measures each —
population, GDP, GDP per capita, life expectancy, adult literacy,
unemployment, CO₂ per capita, internet use and the Human Development Index —
and every figure is sourced and dated (World Bank WDI 2023–2024, UNESCO UIS
2023, Global Carbon Budget 2023, UNDP Human Development Report 2025).

## The pages

- **Home** — a world-at-a-glance strip (countries, people, combined GDP),
  bar charts of the largest populations and the richest countries per
  person, plus featured country cards.
- **Explore** — the full 32-country table with live search, region filter
  and sorting on any column; click a country for its profile.
- **Country pages** — key stats with ranks, life-expectancy and CO₂ charts
  against the 32-country median, a full indicator table with the source and
  year of every figure, and neighbours from the same region.
- **Compare** — up to four countries head to head, in a table and in
  grouped bar charts.
- **Indicators** — what each of the nine measures means, its source and
  year, the median, and the three highest and lowest countries.
- **Sources & method** — every source, the rounding rules, and how to cite
  the site.

The site is plain static files under `app/` — no build step, no network
requests, fully offline, on desktop and on a phone. The charts are
hand-rolled SVG; there is no framework and no vendored library, so the
first load stays small.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Hand it in (writes `out/` with `app/`, `screenshots/` and `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — page shell, navigation, footer
- `app/style.css` — the whole design system
- `app/data.js` — the 32-country dataset, indicator metadata, and helpers
  (`findCountry`, `leaders`, `placeOf`, `medianValue`, `worldTotals`)
- `app/charts.js` — hand-rolled SVG bar charts (`horizontalBars`,
  `groupedBarChart`, `medianCompareBars`)
- `app/views.js` — one render function per page
- `app/main.js` — hash router (route table) and control wiring
- `main.ts` — the entrypoint: copies `app/` + `screenshots/` to the output
  directory and writes `dossier.json` with the vendored make.fun library
- `screenshots/` — 4 real renders of the site (desktop home, explore table,
  country profile, phone home)
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
