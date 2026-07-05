/**
 * OG image capture (website-seo-launch skill).
 * Screenshots the built site's own hero at 1200×630 → public/og.jpg + dist/og.jpg.
 *
 * NOTE: currently a PLACEHOLDER OG built over the placeholder flythrough
 * poster. Re-run after the real frames land for the final og.jpg.
 *
 * Usage:  node scripts/og-capture.mjs [url]
 * Needs a running preview server (default http://localhost:4173/lago-residences/).
 */
import puppeteer from 'puppeteer-core'
import { copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const URL = process.argv[2] || 'http://localhost:4173/lago-residences/'
const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const out = join(ROOT, 'public', 'og.jpg')

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
})
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 })
  // wait past the hero intro animation until the wordmark has settled
  await new Promise((r) => setTimeout(r, 4000))
  await page.screenshot({
    path: out,
    type: 'jpeg',
    quality: 88,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  })
  const distOut = join(ROOT, 'dist', 'og.jpg')
  if (existsSync(join(ROOT, 'dist'))) copyFileSync(out, distOut)
  console.log('OG image written →', out, '(+ dist)')
} finally {
  await browser.close()
}
