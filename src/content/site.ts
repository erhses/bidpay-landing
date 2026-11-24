/**
 * Everything that is likely to change without a redesign: links, wording, example amounts.
 * The Mongolian copy is a first draft and the amounts are examples. Confirm both before launch.
 */

/**
 * Public address of the site, used for canonical links, the sitemap and share previews. Set NEXT_PUBLIC_SITE_URL
 * once there is a real domain. Until then, a Vercel build uses the project's production address, which Vercel
 * provides at build time.
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : 'http://localhost:3000')).replace(/\/$/, '');

export const links = {
  appStore: 'https://apps.apple.com/mn/app/bid-pay/id6745394883',
  googlePlay: 'https://play.google.com/store/apps/details?id=com.bidpay',
  bid: 'https://bid.mn',
} as const;

/** App Store id. Safari on iPhone uses it to offer the app in a banner at the top of the page. */
export const appStoreId = '6745394883';

/**
 * Where both QR codes lead. It is the App Store listing for now, so an Android phone lands in the wrong store.
 * Replace it with a link that sends each phone to its own store.
 */
export const qrTarget: string = links.appStore;

export const meta = {
  title: 'BiD Pay | Одоо ав. Хуваан төл.',
  description: 'Хүссэн зүйлээ өнөөдөр аваад, төлбөрөө хэсэгчлэн төлөх апп. Хуваан төлөлт, хэтэвч, хуримтлал нэг дор.',
};

export const notice = {
  before: 'BiD апп хайж байна уу? Зээлийн үйлчилгээ ',
  link: 'bid.mn',
  after: ' дээр хэвээрээ.',
};

export const nav = [
  { href: '#huvaan', label: 'Хуваан төлөх' },
  { href: '#bolomj', label: 'Боломжууд' },
  { href: '#app', label: 'Апп' },
  { href: '#asuult', label: 'Асуулт' },
] as const;

export const downloadLabel = 'Апп татах';

/** Caption for payment n, used in the diagram and inside the 3D scene. */
export const paymentLabel = (n: number) => `${n}-р төлөлт`;

export const hero = {
  title: ['Одоо ав.', 'Хуваан төл.'],
  lede: 'Хүссэн зүйлээ өнөөдөр аваад, төлбөрөө хэсэгчлэн төл.',
  trust: '2005 оноос тусгай зөвшөөрөлтэй ББСБ',
  /** What the 3D scene shows, for screen readers. */
  sceneLabel: 'Худалдан авалтын дүн хэд хэдэн төлөлт болж хуваагдана. Ард нь BiD Pay апптай утас.',
  /**
   * What the scene shows in turn: [example purchase amount, number of payments]. Each amount divides evenly.
   * The page never states one number of payments; the team's working range is 2 to 6, not yet confirmed.
   */
  cycles: [
    [1_200_000, 3],
    [2_400_000, 6],
    [480_000, 2],
    [1_600_000, 4],
  ] as Array<readonly [number, number]>,
  /** Screenshot shown on the phone in the scene. */
  screen: '/img/app-home.webp',
};

export const split = {
  name: 'Хуваан төлөх',
  title: ['Гурван алхамаар', 'хуваан төл.'],
  lede: 'Хүссэн зүйлээ өнөөдөр аваад, төлбөрийг нь хэсэг хэсгээр төлнө.',
  /** No amounts or number of payments here: the stills show the idea, the app shows the offer. */
  steps: [
    { label: 'Алхам 1', title: 'Худалдан авалтаа сонго', text: 'BiD shop эсвэл хамтрагч дэлгүүрээс хүссэн зүйлээ сонго.', image: '/img/s-choose.webp', alt: 'Дэлгүүрийн цүнх' },
    { label: 'Алхам 2', title: 'Хуваан төлөхийг сонго', text: 'Төлбөр хэсгүүдэд хуваагдаж, хуваарь тэр дороо гарна.', image: '/img/s-split.webp', alt: 'Хэсгүүдэд хуваагдсан төлбөр' },
    { label: 'Алхам 3', title: 'Хэсэг бүрийг цагт нь төл', text: 'Төлөх өдөр, үлдсэн төлөлтөө апп-аасаа хараад төл.', image: '/img/s-pay.webp', alt: 'Эхний хэсэг нь төлөгдсөн, үлдсэн нь хүлээгдэж буй төлбөр' },
  ],
};

export const features = {
  name: 'Боломжууд',
  title: ['Хуваан төлөлтөөс', 'гадна.'],
  lede: 'Хэтэвч, хуримтлал, түвшин. Мөнгөө удирдах бүх зүйл нэг дор.',
  /** The stills are rendered from src/three/stills.js; the tier names on the podium are printed into the image. */
  cards: [
    { tag: 'Хэтэвч', title: 'Орлого, шилжүүлэг, QR', text: 'BiD debit карт мөн энд.', image: '/img/f-wallet.webp' },
    { tag: 'Хуримтлал', title: 'Мөнгөө өсгө', text: 'Хуримтлал нээгээд хуримтлуул.', image: '/img/f-save.webp' },
    { tag: 'Түвшин, оноо', title: 'Ахих тусам илүү', text: 'Standard-аас Алт хүртэл. Худалдан авалт бүр оноо нэмнэ.', image: '/img/f-tiers.webp' },
  ],
};

export const screens = {
  name: 'Апп',
  title: ['Апп дотор'],
  lede: 'Таны харах дөрвөн дэлгэц.',
  items: [
    { label: 'Дэлгэц 1', title: 'Нүүр', text: 'Эрх, төлөлт, төлөх өдөр нэг дэлгэц дээр.', image: '/img/app-home.webp', alt: 'Нүүр дэлгэц: боломжит эрх, дараагийн төлөлт' },
    { label: 'Дэлгэц 2', title: 'Хэтэвч', text: 'Орлого, гүйлгээ, нэхэмжлэх, QR төлбөр.', image: '/img/app-wallet.webp', alt: 'Хэтэвч: карт, сүүлийн гүйлгээ' },
    { label: 'Дэлгэц 3', title: 'Миний санхүүч', text: 'Орлого, зарлагаа долоо хоног, сараар нь хар.', image: '/img/app-tracker.webp', alt: 'Орлого, зарлагын тэнцэл' },
    { label: 'Дэлгэц 4', title: 'Түвшин', text: 'Ахих тусам оноо нэмэгдэнэ.', image: '/img/app-tiers.webp', alt: 'Хэрэглэгчийн түвшин' },
  ],
};

export const faq = {
  name: 'Асуулт',
  title: ['Асуулт, хариулт'],
  items: [
    { q: 'BiD Pay гэж юу вэ?', a: '«Бизнес Инвест Девелопмент ББСБ» ХХК-ийн апп. Хуваан төлөх, төлбөр тооцоо, хуримтлал, BiD shop нэг дор.' },
    { q: 'Хаанаас татах вэ?', a: 'App Store болон Google Play дээр «BID Pay» гэж хайгаад татна.' },
    { q: 'Хуучин BiD апп яах вэ?', a: 'BiD апп хэвээр ажиллана. Дэлгэрэнгүйг bid.mn-ээс харна уу.' },
    { q: 'Миний мэдээлэл аюулгүй юу?', a: 'Бид мөнгө угаах, терроризмыг санхүүжүүлэхтэй тэмцэх болон хувь хүний мэдээлэл хамгаалах хууль тогтоомжийг мөрддөг. Таны мэдээлэл өндөр хамгаалалттай орчинд хадгалагдана.' },
  ],
};

export const getApp = {
  titleDesktop: ['QR уншуулаад', 'BiD Pay-г тат'],
  titleMobile: 'BiD Pay-г тат',
  text: 'Бүртгүүлээд боломжит эрхээ шууд хар.',
  qrCaption: 'Камераар уншуулна уу',
  qrLabel: 'BiD Pay апп татах QR код',
  stores: [
    { device: 'iPhone', name: 'App Store', href: links.appStore },
    { device: 'Android', name: 'Google Play', href: links.googlePlay },
  ],
};

export const footer = {
  about: 'BiD Pay нь «Бизнес Инвест Девелопмент ББСБ» ХХК-ийн апп. Компани 2004 онд байгуулагдаж, 2005 оноос тусгай зөвшөөрөлтэй үйл ажиллагаа явуулж байна.',
  links: [
    { href: '#huvaan', label: 'Хуваан төлөх' },
    { href: '#bolomj', label: 'Боломжууд' },
    { href: '#asuult', label: 'Асуулт' },
    { href: links.bid, label: 'bid.mn', external: true },
  ],
};
