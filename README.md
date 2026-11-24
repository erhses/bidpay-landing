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
NEXT_PUBLIC_SITE_URL=https://your-domain.mn npm run build
```

`NEXT_PUBLIC_SITE_URL` is the public address of the site. It is read at build time and goes into the canonical
link, the sitemap, `robots.txt` and the share preview. Without it, a build on Vercel uses the project's production
address (`*.vercel.app`), and any other build uses `http://localhost:3000`.

## Deploy

The live site is on Vercel, connected to this GitHub repository. Every push to `main` builds and publishes it;
any other branch or pull request gets its own preview address. Vercel detects Next.js, so the project needs no
build settings. Once the real domain is known, add it in Vercel and set `NEXT_PUBLIC_SITE_URL` under the
project's Environment Variables, then redeploy.

The build produces a self-contained server in `.next/standalone`. The Dockerfile packages it:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.mn -t bidpay-landing .
docker run -p 3000:3000 bidpay-landing
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/content/site.ts` | All wording, links, example amounts. Change text here, not in the components. |
| `src/app/layout.tsx` | Fonts, page title and description, share and app-banner tags. |
| `src/app/globals.css` | All styles. Colours and type are the variables at the top. |
| `src/components/` | One file per section of the page, top to bottom: `Notice`, `Header`, `Hero`, `Split`, `Features`, `Screens`, `Faq`, `Download`, `Footer`. |
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
- The stills (`public/img/s-*.webp` for the payment steps, `f-*.webp` for the features, and `hero-poster.webp`)
  are rendered, never drawn by hand. After changing a model, render them all again:

  ```bash
  NODE_PATH=/path/to/node_modules node research/tools/render-stills.js
  ```

  This needs Playwright with Chromium on `NODE_PATH` (`npm i playwright@1.48.2` anywhere, then
  `npx playwright install chromium`). Every still is framed by its own outline at the same camera angle, on a
  transparent background; the page puts each on the same plate.
- The tiers still shows four medals, Standard to gold, growing and rising; no words are printed on it.
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
- **Card design.** The BiD debit card in the Хэтэвч still is invented, including the number.
- **Tier colours.** The medals use charcoal for Standard, then bronze, silver and gold, after the app's tier badges.
- **QR target.** `qrTarget` in `site.ts` is the App Store listing, so Android phones scanning it land in the
  wrong store. Use a link that routes each phone to its own store.
- **Legal pages.** There are no terms or privacy links yet.
- **Domain.** Set `NEXT_PUBLIC_SITE_URL` in Vercel once the address is known (see Deploy).
- **Real devices.** The 3D scene has been checked in a headless browser only. Test it on mid-range Android
  phones before launch.
