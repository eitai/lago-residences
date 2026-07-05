/**
 * End-to-end browser verification (real Chrome via puppeteer-core).
 *
 *  - loads the production preview build
 *  - collects console errors + page errors
 *  - drives the flythrough scrub and asserts the canvas actually changes
 *  - exercises the apartment selector → booking prefill → lead-form success
 *  - saves screenshots to verify/
 *
 * Usage:  node scripts/verify.mjs [url]
 * Needs a running preview server (default http://localhost:4173/lago-residences/).
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const VERIFY_DIR = join(ROOT, 'verify')
mkdirSync(VERIFY_DIR, { recursive: true })

const URL = process.argv[2] || 'http://localhost:4173/lago-residences/'
const CHROME =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const shot = (page, name) =>
  page.screenshot({ path: join(VERIFY_DIR, name), type: 'png' })

const results = []
const ok = (label, pass, extra = '') => {
  results.push({ label, pass, extra })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}${extra ? ' — ' + extra : ''}`)
}

const consoleErrors = []
const pageErrors = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars', '--window-size=1440,900'],
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text())
  })
  page.on('pageerror', (e) => pageErrors.push(e.message))

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 45000 })
  await new Promise((r) => setTimeout(r, 4500)) // hero intro
  await shot(page, '01-hero.png')
  ok('Hero loads', true)

  // --- fonts actually loaded (self-hosted) --------------------------------
  const frankLoaded = await page.evaluate(() =>
    document.fonts.check('300 40px "Frank Ruhl Libre"'),
  )
  ok('Self-hosted Hebrew display font loaded', frankLoaded)

  // --- flythrough scrub: canvas must change as we scroll through -----------
  const canvasSel = '#flythrough canvas'
  await page.waitForSelector(canvasSel, { timeout: 10000 })

  // move pointer over the section and wheel down in steps; sample the canvas.
  const section = await page.$('#flythrough')
  const box = await section.boundingBox()
  await page.mouse.move(box.x + box.width / 2, 400)

  const sampleCanvas = () =>
    page.evaluate((sel) => {
      const c = document.querySelector(sel)
      if (!c) return null
      // hash a downscaled snapshot so we can compare cheaply
      const tmp = document.createElement('canvas')
      tmp.width = 32
      tmp.height = 18
      const ctx = tmp.getContext('2d')
      ctx.drawImage(c, 0, 0, 32, 18)
      return tmp.toDataURL('image/png')
    }, canvasSel)

  const samples = []
  samples.push(await sampleCanvas())
  for (let i = 0; i < 14; i++) {
    await page.mouse.wheel({ deltaY: 500 })
    await new Promise((r) => setTimeout(r, 340))
    if (i === 2) {
      // mid-flight — a storyboard caption should be on screen
      await new Promise((r) => setTimeout(r, 250))
      await shot(page, '02-flythrough-mid.png')
      samples.push(await sampleCanvas())
    }
  }
  samples.push(await sampleCanvas())
  const distinct = new Set(samples.filter(Boolean)).size
  ok('Flythrough canvas scrubs (frames change on scroll)', distinct >= 2, `${distinct} distinct frames`)

  // --- apartment selector -------------------------------------------------
  await page.evaluate(() => {
    document.querySelector('#apartments')?.scrollIntoView()
  })
  await new Promise((r) => setTimeout(r, 800))

  // pick the "5 חדרים" type tab (3rd tab)
  const tabPicked = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#apartments [role="tab"]')]
    const t = tabs.find((el) => el.textContent.includes('5 חדרים'))
    if (!t) return false
    t.click()
    return true
  })
  await new Promise((r) => setTimeout(r, 500))
  const areaText = await page.evaluate(
    () => document.querySelector('#apartments')?.textContent || '',
  )
  ok('Selector switches apartment type', tabPicked && areaText.includes('146 מ״ר'), '5-room area shown')
  await page.evaluate(() => document.querySelector('#apartments')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 400))
  await shot(page, '03-selector.png')

  // click "לתיאום סיור" in the card
  const booked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#apartments button')]
    const b = btns.find((el) => el.textContent.trim() === 'לתיאום סיור')
    if (!b) return false
    b.click()
    return true
  })
  await new Promise((r) => setTimeout(r, 1500))
  const prefilled = await page.evaluate(
    () => document.querySelector('#lead-message')?.value || '',
  )
  ok('Booking prefills the lead form', booked && prefilled.includes('מתעניין'), prefilled.slice(0, 48) + '…')

  // --- lead form submit → success ----------------------------------------
  await page.evaluate(() => document.querySelector('#lead')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 500))
  await page.type('#lead-name', 'ישראל ישראלי', { delay: 8 })
  await page.type('#lead-phone', '050-123-4567', { delay: 8 })
  await page.evaluate(() => {
    const form = document.querySelector('#lead form')
    form?.requestSubmit()
  })
  await new Promise((r) => setTimeout(r, 700))
  const successShown = await page.evaluate(() => {
    const s = document.querySelector('#lead [role="status"]')
    return !!s && s.textContent.includes('תודה')
  })
  ok('Lead form shows mock success screen', successShown)
  await page.evaluate(() => document.querySelector('#lead')?.scrollIntoView())
  await new Promise((r) => setTimeout(r, 400))
  await shot(page, '04-lead-success.png')

  // --- console cleanliness -----------------------------------------------
  ok('No console errors', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '))
  ok('No page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
if (consoleErrors.length) console.log('console errors:', consoleErrors)
if (pageErrors.length) console.log('page errors:', pageErrors)
process.exit(failed.length ? 1 : 0)
