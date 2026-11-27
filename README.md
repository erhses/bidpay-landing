# BiD Pay landing page

The public landing page for the BiD Pay app. One page, in Mongolian, built with Next.js (App Router), React and
TypeScript. The hero is a live 3D scene drawn with three.js.

## Run it

Requires Node 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build and serve

```bash
npm run lint
npm run type-check
npm run build
```

The site's public address is `siteUrl` in `src/content/site.ts`. It goes into the canonical link, the sitemap,
`robots.txt` and the share preview, so change it there if the domain ever changes.

## Deploy

The site deploys the same way as the BiD landing (`bid-landing-front-new`): a Docker image is built on your machine,
copied to the BiD server (`103.153.141.134`, into `/home/cloudmn/bidpay/`, created on the first push) and run there. It needs Docker running
locally and SSH access to the server as `root`. The `Makefile` holds every step and every setting, with
nothing else to set: the site's address lives in the code (`siteUrl` in `src/content/site.ts`). To deploy:

```bash
make full-deploy
```

That runs three steps, which also work on their own:

| Step | What it does |
| --- | --- |
| `make build` | Builds the `bidpay-landing` image for `linux/amd64`. |
| `make push` | Saves the image to `bidpay-landing.tar` and copies it to `/home/cloudmn/bidpay/` on the server with `scp`. |
| `make ssh-deploy` | On the server: loads the image, replaces the `bidpay-landing` container, and prints its status and logs. |

The container listens on port 3004 (that server already uses 3001, 3003 and 8086), restarts with the server, and serves
plain HTTP. On the server, nginx serves `https://bidpay.mn` and `www.bidpay.mn` and passes them to `127.0.0.1:3004`
(`/etc/nginx/conf.d/bidpay.conf`, next to the BiD sites' `bid_web.conf`; a copy is in `deploy/nginx-bidpay.conf`).
Plain `http://` is redirected to `https://bidpay.mn`. The certificate is Let's Encrypt, from certbot, and renews by
itself. Deploys never touch nginx. Any of the Makefile's settings can be changed per run, e.g.
`make ssh-deploy HOST_PORT=3010`.

To try the image locally:

```bash
make build
docker run --rm -p 3004:3004 bidpay-landing
```

The build produces a self-contained server in `.next/standalone`, which is what the image ships. The site also
builds on Vercel with no settings, if a preview address is ever needed.

## Where things are

| Path | What it holds |
| --- | --- |
| `src/content/site.ts` | All wording, links, example amounts. Change text here, not in the components. |
| `src/app/layout.tsx` | Fonts, page title and description, share and app-banner tags. |
| `src/app/globals.css` | All styles. Colours and type are the variables at the top. |
| `src/components/` | One file per section of the page, top to bottom: `Notice`, `Header`, `Hero`, `Split`, `Features` (with `TierBadge`), `Screens`, `Faq`, `Download`, `Footer`. |
| `src/three/` | The 3D kit (`kit.js`), the hero scene built from it (`bp3d.js`), and the poses for the still images (`stills.js`). |
| `public/img/` | App screenshots, the rendered 3D stills, the icon. |
| `prototype/` | An earlier approved prototype, kept for reference only; the page has moved on since. Not part of the build. |
| `research/` | The design research board and its capture scripts. Not part of the build. |

## How the hero works

The words are on screen from the first paint. Beside them, a phone running the app rises into place, then the
price of a purchase appears in front of it, is cut into payments, and each piece turns over to show its amount;
the first is marked paid in orange. Each cycle uses a new amount and a new number of payments
(`hero.cycles` in `site.ts`).

1. A small script in `layout.tsx` runs before first paint. If the visitor allows motion and the browser has
   WebGL, it sets `data-3d` on `<html>`, which keeps the still image hidden so it does not flash first.
2. `Hero.tsx` loads the 3D scene as a separate chunk, so it does not hold up the page, and fades it in.
3. If the scene fails to load, the still comes back; CSS also brings it back after 5 seconds if no script runs.

With reduced motion, without WebGL or without JavaScript, the page shows the still (`public/img/hero-poster.webp`).

## Colour

Orange is an accent only: the download buttons, the paid payment, the diagram's flow, section markers, and
hover states. Backgrounds stay paper, white and ink. Keep it that way when adding sections.

## Review link

The team reviews the page at a private claude.ai link that cannot run Next.js. `research/tools/preview.py`
builds a static copy from the production build for it:

```bash
npm run build
python3 research/tools/preview.py /path/to/out
```

The copy uses the real prerendered markup and stylesheet, and the real 3D module. Its client behaviour comes from
`research/tools/preview.js`, a plain-script stand-in for `Header`, `Hero`, `ScrollEffects` and
`DownloadLink`; update it when those change.

## 3D notes

- **One material.** Every object on the page is the same soft clay in two tones, charcoal and brand orange, with
  white only for small details; the tier medals add bronze, silver and gold in the same clay. One studio
  light. All of it is defined once in `src/three/kit.js`: the palette, the `clay()` material, the light, and every
  model (phone, price slab, bag, payment pieces, cards, coins, tier medals). New objects belong there too.
- `src/three/bp3d.js` is the live hero scene; `src/three/stills.js` poses the still images. Both build from the kit.
- The stills (`public/img/s-*.webp` for the payment steps, and `hero-poster.webp`)
  are rendered, never drawn by hand. After changing a model, render them all again:

  ```bash
  NODE_PATH=/path/to/node_modules node research/tools/render-stills.js
  ```

  This needs Playwright with Chromium on `NODE_PATH` (`npm i playwright@1.48.2` anywhere, then
  `npx playwright install chromium`). Every still is framed by its own outline at the same camera angle, on a
  transparent background; the page puts each on the same plate.
- Section 3 (`Features.tsx`) no longer uses 3D stills: it shows the real service wordmarks (`public/img/bid/`) and
  the app's own tier badge artwork (`public/img/tiers/`, shown by `TierBadge.tsx`). Its motion lives in
  `FeatureMotion.tsx` and `TierSpot.tsx`: the service stack turns over every few seconds while on screen (pausing
  under the pointer); savings goals (after X Money's pots and Quicken's goal cards) rise in, fill their bars, drift,
  and the reward goal gives off a "+ урамшуулал" chip; the tier badge turns from Standard to gold in a spotlight
  above a track of the four tiers (after FARFETCH), and tapping a tier stops it there. Without script or with
  reduced motion everything shows complete and still, resting on Standard. The savings goal names are examples. The `f-*.webp` stills and their models in the kit are no longer on the page.
- `three` is pinned to 0.128.0. The colour and lighting code targets that release; later releases changed colour
  management and light units, so an upgrade needs the scene re-tuned by eye.
- The phone in the scene shows `public/img/app-home.webp`. Replace that file to update the screen.

## Before launch

These are placeholders or unconfirmed and need a decision from the BiD Pay team:

- **Wording.** All Mongolian copy in `src/content/site.ts` is a first draft.
- **Number of payments.** The page never states one number. The hero shows examples from 2 to 6
  (`hero.cycles` in `site.ts`), which is the team's working range, not yet confirmed. Also unconfirmed: whether
  payments are equal, and anything about fees or interest (the page says nothing on either).
- **Amounts.** The figures in the hero are examples. The rest of the page shows none.
- **Services.** Section 3 shows BiD credit, debit, point and Барьцаат credit with their real wordmarks (originals in
  `research/assets/`), drawn as a stack of cards. They are not cards: BiD offers no card service, so the copy never
  says карт and the cards carry no chip or contactless mark. Their colours are bright orange, ink, a cool slate and
  a deep navy (orange's opposite); the one-line descriptions are placeholders; confirm them.
- **Tier screenshot.** Section 3 uses the app's own tier badges (`public/img/tiers/`, originals in
  `research/assets/`). The Хэрэглэгчийн түвшин screenshot in the Апп дотор section still shows tier thresholds and
  point percentages, which PRODUCT.md keeps off the page.
- **QR target.** `qrTarget` in `site.ts` is the App Store listing, so Android phones scanning it land in the
  wrong store. Use a link that routes each phone to its own store.
- **Legal pages.** There are no terms or privacy links yet.
- **Real devices.** The 3D scene has been checked in a headless browser only. Test it on mid-range Android
  phones before launch.
