// StatAtlas entrypoint (Node 22, standard library only).
//
// The site is plain static files in app/ (index.html, CSS, ES modules and
// one data file), with no build step and no network requests: a browser opens
// app/index.html and everything it loads is a file under app/. The screenshots
// in screenshots/ are real renders of that site, taken in headless Chrome.
//
// This program hands the entry in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there —
// the summary the judge reads (screenshots, first-load files and bytes, and
// the site's source), built with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts untouched: the scorer requires dossier.json to
// be byte for byte what its own copy of that library writes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function handIn() {
  mkdirSync(outDir, { recursive: true });
  cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(join(here, 'screenshots'))) {
    cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
  }

  // The scorer's own caps (from the kit's reference gate): only
  // text_max_bytes shapes the dossier text; the others refuse an entry the
  // scorer would refuse (more than 4 screenshots or one over 256 KiB; more
  // than 993 files and directories in app/, or 16 MiB of app files). The
  // write is deterministic: the same repository always produces the same
  // dossier bytes, so the grader's two runs agree.
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  console.log(`StatAtlas handed in to ${outDir} (${dossier.length} bytes of dossier)`);
}

handIn();
