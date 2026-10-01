/**
 * Builds george-stathopoulos-cv.pdf from cv/cv.html with headless Chrome.
 *
 * Run from the site folder: node cv/build-cv.mjs
 * Needs Google Chrome and the playwright-core package (it is installed in ../ai-gateway).
 */
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname( fileURLToPath( import.meta.url ) );
const require = createRequire( join( here, '../../ai-gateway/package.json' ) );
const { chromium } = require( 'playwright-core' );

const browser = await chromium.launch( { channel: 'chrome' } );
const page = await browser.newPage();
await page.goto( pathToFileURL( join( here, 'cv.html' ) ).href, { waitUntil: 'networkidle' } );
await page.pdf( {
	path: join( here, '../george-stathopoulos-cv.pdf' ),
	format: 'A4',
	printBackground: true,
	preferCSSPageSize: true,
	tagged: true,
	outline: true,
} );
await browser.close();
console.log( 'george-stathopoulos-cv.pdf written' );
