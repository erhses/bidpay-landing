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

/**
 * Section 3 is there to earn trust: the lender behind the app, and the real products in it. Facts here are only those
 * the team has confirmed (founded 2004, licensed since 2005); no counts, ratings or terms.
 */
export const features = {
  name: 'Боломжууд',
  title: ['20 гаруй жилийн', 'итгэлцэл.'],
  lede: '«Бизнес Инвест Девелопмент ББСБ» ХХК 2005 оноос тусгай зөвшөөрөлтэй. Хуримтлал, түвшин, BiD-ийн үйлчилгээ бүгд BiD Pay-д.',
  facts: [
    { big: '2004', small: 'онд байгуулагдсан' },
    { big: '2005', small: 'оноос тусгай зөвшөөрөлтэй ББСБ' },
    { big: '4', small: 'BiD-ийн үйлчилгээ нэг апп-д' },
  ],
  /**
   * BiD's services, drawn as a stack of cards the way the app shows them. They are not cards: BiD offers no card
   * service, so never call them карт, and never give them a chip or a contactless mark. Each shows its own wordmark
   * and one line. The first is in front; the stack turns over on its own.
   */
  services: {
    title: 'BiD-ийн үйлчилгээ',
    text: 'Credit, debit, point, барьцаат credit. Бүгд нэг апп-д.',
    /** Placeholder colours and one-line descriptions: confirm both with the team. */
    tiles: [
      { id: 'debit', name: 'BiD debit', line: 'Өдөр тутмын төлбөр', tone: 'orange' },
      { id: 'credit', name: 'BiD credit', line: 'Зээлийн эрх', tone: 'dark' },
      { id: 'point', name: 'BiD point', line: 'Оноо цуглуулах', tone: 'slate' },
      { id: 'secured', name: 'BiD Барьцаат credit', line: 'Барьцаат зээл', tone: 'light' },
    ],
  },
  /**
   * Savings goals floating on a stage (after X Money's savings pots and Quicken's goal cards). The goal names are
   * examples, and the bars show progress without amounts. The reward goal keeps giving off a small "+" chip.
   */
  savings: {
    title: 'Хуримтлал',
    text: 'Зорилгоо тавиад хуримтлуул. Ганцаараа, эсвэл бусадтай хамт.',
    note: 'Мөнгө, Алт түвшинд урамшууллын хуримтлал таны нэр дээр нэмэгдэнэ.',
    plus: '+ урамшуулал',
    pots: [
      { icon: 'trip', name: 'Аялал', sub: 'Өөрийн хуримтлал', fill: 68 },
      { icon: 'phone', name: 'Шинэ утас', sub: 'Өөрийн хуримтлал', fill: 41 },
      { icon: 'group', name: 'Гэр бүлийн аялал', sub: 'Хамтын хуримтлал', fill: 55, faces: ['Б', 'Н', 'О'] },
      { icon: 'star', name: 'Урамшууллын хуримтлал', sub: 'Мөнгө, Алт түвшинд', fill: 30, reward: true },
    ],
  },
  /**
   * One badge in the spotlight, turning from Standard to gold, with a track of the four tiers below (after FARFETCH's
   * tier switcher). The mechanism only: thresholds and percentages are not published. Points come from paying on time.
   */
  tiers: {
    title: 'Түвшин',
    text: 'Цагтаа төлөх тусам Стандартаас Алт хүртэл ахина.',
    list: [
      { id: 'standard', name: 'Стандарт', line: 'Эхлэл. Цагтаа хийсэн төлөлт бүр оноо болно.' },
      { id: 'bronze', name: 'Хүрэл', line: 'Бүрэн төлж дуусгасан худалдан авалт бүр таныг ахиулна.' },
      { id: 'silver', name: 'Мөнгө', line: 'Credit зээлийн төлсөн хүүгийн нэг хэсэг урамшууллын хуримтлал болно.' },
      { id: 'gold', name: 'Алт', line: 'Хамгийн дээд түвшин. Урамшууллын хуримтлал таны нэр дээр.' },
    ],
  },
} as const;

export const screens = {
  name: 'Апп',
  title: ['Апп дотор'],
  lede: 'Таны харах дөрвөн дэлгэц.',
  items: [
    { label: 'Дэлгэц 1', title: 'Нүүр', text: 'Эрх, төлөлт, төлөх өдөр нэг дэлгэц дээр.', image: '/img/app-home.webp', alt: 'Нүүр дэлгэц: боломжит эрх, дараагийн төлөлт' },
    { label: 'Дэлгэц 2', title: 'Хэтэвч', text: 'Орлого, гүйлгээ, нэхэмжлэх, QR төлбөр.', image: '/img/app-wallet.webp', alt: 'Хэтэвч: BiD debit, сүүлийн гүйлгээ' },
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
