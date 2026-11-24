# Assembles the board: template.html + reference notes + capture metadata -> research/board/index.html
import json, os, sys, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import round2
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]
meta = json.load(open(os.path.join(S, 'meta.final.json')))
mob = json.load(open(os.path.join(S, 'mobbin_all.json')))

# --- Mobbin's own tags and a public link for each featured site ---
MOBNAME = {'klarna': 'Klarna', 'cashapp': 'Cash App', 'revolut': 'Revolut', 'current': 'Current', 'fluz': 'Fluz', 'jeton': 'Jeton', 'uglycash': 'UGLYCASH', 'origin': 'Origin', 'mercury': 'Mercury', 'ramp': 'Ramp', 'titan': 'Titan', 'fruitful': 'Fruitful', 'metamask': 'MetaMask', 'slush': 'Slush', 'headspace': 'Headspace', 'slash': 'Slash', 'framer': 'Framer', 'discord': 'Discord'}
RENAME = {'ui-animations': 'motion', 'scroll-effects': 'scroll effects', 'black-white': 'b&w'}
def mobbin_info(name):
    styles, secs, link = [], [], None
    for page, cards in mob.items():
        for c in cards:
            if c['alt'].replace(' section', '').strip() != name: continue
            for t in c['tags']:
                kind, slug = t.split('/')[0], t.split('/')[-1]
                if kind == 'styles' and RENAME.get(slug, slug) not in styles: styles.append(RENAME.get(slug, slug))
                if kind == 'sections' and slug not in secs: secs.append(slug)
            if link is None or ('sections/hero-section' in c['tags'] and 'hero' not in link[1]): link = (c['href'], 'hero' if 'sections/hero-section' in c['tags'] else '')
    return styles, secs, ('https://mobbin.com' + link[0]) if link else None

R = []
def ref(id, name, url, group, why, take, skip, tags=None, rnd=1):
    r = dict(id=id, name=name, url=url, group=group, why=why, take=take, skip=skip, round=rnd)
    if id in MOBNAME:
        st, secs, link = mobbin_info(MOBNAME[id]); r['tags'] = st; r['mobbin'] = link
        r['sectionsSeen'] = [s.replace('-section', '').replace('-', ' ') for s in secs if s in ('hero-section', 'how-it-works', 'features', 'stats-section', 'social-proof', 'cta-section', 'downloads')]
    else: r['tags'] = tags or []
    m = meta[id]; r['palette'] = m['palette']; r['fonts'] = [f for f in m.get('fonts', []) if not re.search(r'Material Symbols|Emoji|dashicons|^wfont|^Bold$|^Regular$|^TTRegular$', f)][:2]; r['mobile'] = bool(m.get('mobile'))
    R.append(r)

# ---------------- Mongolia ----------------
ref('storepay', 'StorePay', 'https://storepay.mn', 'mn',
    'The direct competitor and the cleanest local site. Headline, two buttons, three numbers and press badges in one calm first screen.',
    ['Three numbers right under the buttons: 680,000+ users, 9,000+ merchants, 5.3 million purchases', 'Three phone screens that walk through invoice, split terms and confirmation', 'Light and dark toggle, plus text-size controls for accessibility'],
    ['The right half of the hero stayed empty in our capture', 'The token section (SPCFIN) pulls attention away from the pay-later story'], ['minimal', 'light', 'photography'])
ref('toki', 'Toki', 'https://www.toki.mn', 'mn',
    'Super-app positioning. Opens on a full-screen lifestyle photo, then turns black with one large photo card per product pillar.',
    ['One card per pillar (Lifestyle, Shop, Pay, Mobile) with real UI chips over photography', 'Credit limits shown as coloured tiles: 1,000,000₮, 3,000,000₮, 8,000,000₮', 'Closing band with a phone and all three store badges'],
    ['Sky-and-person hero is the same idea as Revolut, so it will not feel distinctive', 'The English slogan tells a new visitor nothing about what the app does'], ['photography', 'dark', 'bold'])
ref('pocket', 'Pocket', 'https://pocket.mn', 'mn',
    'Digital lender. The home page is a rotating campaign banner followed by a loan-terms table next to a phone.',
    ['Loan terms as a plain table beside the app screen: amount, rate and term at a glance'],
    ['Rotating banner hero: the message changes before you finish reading it', 'Long empty stretches further down the page'], ['light', 'photography'])
ref('hipay', 'Hipay', 'https://hipay.mn', 'mn',
    'Payment wallet on a 2019-style template: phone render, icon trio, partner logos, contact form. Useful as the baseline to beat.',
    ['Merchant onboarding as 01, 02, 03 on a full pink band', 'Partner logo row'],
    ['Generic phone mockup with an all-caps slogan', 'Blog and contact form on the home page make it long and unfocused'], ['light'])
ref('monpay', 'MonPay', 'https://monpay.mn/mn', 'mn',
    "Mobicom's wallet. Tidy hero with three store badges (App Store, Google Play, AppGallery) sitting where the button would be.",
    ['Store badges in the hero, including Huawei AppGallery', 'Partner count as a section title: 6,000+ partner organisations'],
    ['All-caps headline with no concrete benefit', 'Two overlapping phone screenshots too small to read'], ['light', 'minimal'])
ref('simple', 'Simple', 'https://simple.mn', 'mn',
    'Digital lender. Tilted phone renders and a teal paragraph where the headline should be.',
    ['Audience split in the nav: citizens, business, merchants, investors'],
    ['A six-line paragraph as the hero headline', 'No button or download prompt in the first screen'], ['light', 'minimal', '3d'])
ref('sono', 'Sono', 'https://sono.mn', 'mn',
    'Fintech lender with the most current-looking local layout: centred headline, small pill label, two buttons, stats row, product cards.',
    ['Pill label above the headline that says what the company is', 'Four-number stats card overlapping the edge of the hero', 'Product cards with one-line terms'],
    ['Large empty purple block in the hero (a video that had not loaded in our capture)'], ['light', 'minimal'])
ref('bid', 'BiD today', 'https://bid.mn', 'mn',
    "The lender's current site and the older BiD app's home. Opens on a loan calculator with the horse mascot over a city photo.",
    ['A working calculator in the first screen: move a slider, see the monthly payment', 'The mascot gives the brand a face that BID Pay could reuse sparingly'],
    ['Red and navy identity: BID Pay is orange, so the two need a visible link without sharing a palette', 'Corporate sections (about, news, sustainability) do not belong on a product page'], ['light', 'illustration', 'photography'])

# ---------------- Global BNPL ----------------
ref('klarna', 'Klarna', 'https://www.klarna.com/us/', 'bnpl',
    'The category leader. Photo carousel hero with a pink Get-the-app QR card, then a pinned section that steps through five promises.',
    ['QR card fixed to the corner of the hero on desktop', 'Four headline numbers directly under the hero', 'Pinned list where one line lights up at a time as you scroll', 'Real Trustpilot reviews'],
    ['Carousel hero hides the main message behind rotating campaigns'])
ref('affirm', 'Affirm', 'https://www.affirm.com', 'bnpl',
    'Pay-over-time lender. Dark navy, thin type with one italic word, and a seasonal headline. The product is explained in stacked glass cards.',
    ['One italic word in the headline: warmth without illustration', 'A store search field as its own section', 'App rating with a QR code beside the footer'],
    ['Seasonal hero says nothing about how payment works', 'Low contrast inside the card stack'], ['dark', 'minimal', 'typography'])
ref('afterpay', 'Afterpay', 'https://www.afterpay.com/en-US', 'bnpl',
    'Shortest page of the set: fashion photo, a white card with one sentence and a QR code, three benefits, done.',
    ['Hero card: one line, one sentence, one QR code', 'Three plain benefits with small icons and no boxes', 'The offer in three words: Pay in 4'],
    ['Editorial photography only works with a real shoot'], ['photography', 'light', 'bold'])
ref('tabby', 'Tabby', 'https://tabby.ai/en-AE', 'bnpl',
    'Gulf BNPL turned money app. Mint green first screen, store ratings above the headline, a crowd of drawn characters, QR button.',
    ['Store ratings above the headline: 4.8 stars with review counts', 'Each feature gets its own colour tile with a phone screen inside', 'Closing band repeats the hero colour with a hand-held phone and QR', 'Wordmark as tall as the footer'],
    ['The character illustrations are theirs. Copying the style would read as Tabby'], ['colorful', 'illustration', 'fun', 'bold'])
ref('tamara', 'Tamara', 'https://tamara.co/en-SA', 'bnpl',
    'Saudi BNPL. Heavy navy headline with a QR under it, and benefit chips floating over a portrait: No late fees, Sharia compliant.',
    ['Floating chips that state the terms in two words each', 'Four photo cards in a grid, one promise per card', 'Product carousel that shows what you can actually buy', 'FAQ accordion before the footer'],
    ['Sparkle decorations will date quickly'], ['bold', 'light', 'photography', 'fun'])
ref('atome', 'Atome', 'https://www.atome.sg', 'bnpl',
    'Southeast Asian BNPL. Yellow comic-style campaign hero, then a store directory. The page is mostly a shop window.',
    ['QR card that follows you down the whole page', 'Merchant tiles by category right after the hero', 'A plain sentence: split your purchase into 3 or more payments'],
    ['A prize-campaign hero is out of date in weeks', 'Busy: yellow, comic art, photos and tiles all compete'], ['colorful', 'illustration', 'bold'])
ref('zip', 'Zip', 'https://zip.co/us', 'bnpl',
    'US BNPL. Deep purple with a lime button, and the best one-liner in the category: split big payments into not-so-big ones.',
    ['Headline plus one line that says exactly what the product does', 'Three store ratings under the button', 'How it works as a pinned phone that changes while the steps scroll past: anywhere, online, in store', 'Calendar screen showing that a payment date can be moved'],
    ['Purple on purple is hard to read in places'], ['dark', 'colorful', 'bold'])

# ---------------- Mobbin picks ----------------
ref('cashapp', 'Cash App', 'https://cash.app', 'mobbin',
    'The whole home page is one green screen: six words, one phone, two buttons. Nothing else.',
    ['Total colour commitment: brand green from edge to edge', 'A real app screen as the only image', 'Proof that a home page can be one screen long'],
    ['It works because everyone already knows Cash App. A new product has more explaining to do'])
ref('revolut', 'Revolut', 'https://www.revolut.com', 'mobbin',
    'A portrait against blue sky with the account balance floating over it. Then cinematic full-width photos, one per product.',
    ['App UI floating directly over a photo instead of inside a phone frame', 'One full-screen scene per feature', 'Plans table at the end'],
    ['Needs a campaign-grade photo shoot', 'Toki already uses this look locally'])
ref('current', 'Current', 'https://current.com', 'mobbin',
    'US neobank. White page, very large light type, one photo, a phone-number field instead of a button, press logos below.',
    ['Phone-number field in the hero: get the download link by SMS', 'Press logo row closing the first screen', 'Collage illustrations that mix photos with drawn shapes', 'Testimonials with store star ratings'],
    ['Long legal footer'])
ref('fluz', 'Fluz', 'https://fluz.app', 'mobbin',
    'Cashback app. Dark warm gradient and a condensed all-caps headline, with a Business / Personal switch above it.',
    ['Audience switch in the hero: the BiD / BID Pay question could use the same control', 'Short all-caps headline: YOUR MONEY ON MAX', 'Blunt one-line statement bands between sections'],
    ['The dark brown palette feels heavy for shopping'])
ref('jeton', 'Jeton', 'https://www.jeton.com', 'mobbin',
    'Wallet app. Coral-to-peach gradient, a glass disc and huge white type. Orange-family colour used softly rather than loudly.',
    ['How to make warm orange feel premium: gradient, glass, white type', 'Store badges in the hero', 'Single words that fill the screen as you scroll: Add, Send, Exchange', 'Closing line: 1 million users, plus you'],
    ['Very long page with one idea per screen', 'Regulatory pop-up on arrival'])
ref('uglycash', 'Uglycash', 'https://ugly.cash', 'mobbin',
    'Stablecoin account. Black condensed capitals stacked over a phone, neon tiles, and a wordmark as tall as the footer.',
    ["Headline as a provocation: YOUR BANK WON'T DO THIS", 'Three-card how-it-works straight after the hero', 'A one-sentence statement band with a real number in it'],
    ['Deliberately rough. Wrong tone for a licensed lender'])
ref('origin', 'Origin', 'https://useorigin.com', 'mobbin',
    'AI financial advisor. Serif headline over a photographed sky, a phone rising from the bottom edge, then near-black sections.',
    ['Phone cropped by the bottom of the hero so the screen reads large', 'Award laurels as quiet proof', 'Nature photography inside cards to warm up a dark page'],
    ['Serif plus sky reads as wealth management, not shopping'])
ref('mercury', 'Mercury', 'https://mercury.com', 'mobbin',
    'Business banking. A desk on a mountain at dawn, a thin centred headline and an email field. The benchmark for calm.',
    ['One surreal image that carries the brand promise', 'Sign-up field in the hero', 'Slow, restrained scroll motion'],
    ['Built for founders. Too quiet for a consumer shopping app'])
ref('ramp', 'Ramp', 'https://ramp.com', 'mobbin',
    'Corporate cards. White, one sentence, an email field with a yellow button, and the product working underneath.',
    ['Five-word headline: Time is money. Save both.', 'Product UI shown in use under the hero, not as a flat screenshot', 'Thin announcement strip above the nav'],
    ['B2B density further down the page'])
ref('titan', 'Titan', 'https://www.titan.com', 'mobbin',
    'Wealth manager. Black, a serif wordmark the width of the page, three lines of plain copy, employer logos.',
    ['Proof through who uses it: trusted by employees of…', 'Four facts in a row with no decoration'],
    ['Formal and exclusive on purpose. The opposite of pay-later'])
ref('fruitful', 'Fruitful', 'https://www.fruitful.com', 'mobbin',
    'Financial planning. Soft blue-green wash, centred headline, and a question field with five goal chips under it.',
    ['Goal chips under the hero: tap what you came for', 'A phone that stays pinned while the text beside it changes', 'Award badges directly under the first screen', 'Customer photos with quotes'],
    ['A chat-style input promises a conversation the product must then deliver'])
ref('metamask', 'MetaMask', 'https://metamask.io', 'mobbin',
    'Crypto wallet. Condensed black headline, one gradient shape, then a grid of bright illustrated cards.',
    ['Four colour-blocked cards in a row, each a different product', 'Orange closing banner with a QR code', 'Stat strip of three numbers with two-word labels'],
    ['Crypto cues throughout: tickers, trading screens'])
ref('slush', 'Slush', 'https://slush.app', 'mobbin',
    'Crypto wallet. The name fills the screen in black capitals over a 3D blue ribbon, with sticker icons scattered on top.',
    ['Stickers and 3D objects layered over the type', 'Rounded page frame: the whole site sits inside a card', 'Marquee band repeating one call to action'],
    ['Maximal. Every section shouts'])
ref('headspace', 'Headspace', 'https://www.headspace.com', 'mobbin',
    'Not finance. It is here as the best-known orange brand on the web: an orange sun, a pink-to-peach wash, blue buttons.',
    ['Orange as the hero object, not the background', 'A contrasting button colour, so the action does not vanish into the brand colour', 'Goal picker right under the hero', 'Three big numbers over a sky photo'],
    ['Discount-led hero'])

round2.add(ref)

# ---------------- directions ----------------
A = '''<div class="nav"><span class="logo">BiD <b>Pay</b></span><span class="navbtn">Апп татах</span></div>
<h4>Одоо ав.<br><b>Хуваан төл.</b></h4><p class="sub">Хүссэн зүйлээ өнөөдөр аваад, төлбөрөө 4 хуваан төл.</p>
<span class="cta">Апп татах</span><span class="ghost">Хэрхэн ажилладаг вэ?</span>
<div class="stats"><span><b>2005</b>оноос тусгай зөвшөөрөлтэй</span><span><b>4×</b>хуваан төлөлт</span></div>
<div class="card"><small>BID shop · нийт дүн</small><strong>480,000₮</strong><div class="bar4"><i class="on"></i><i class="on"></i><i></i><i></i></div><div class="rows"><div><span>1-р төлөлт</span><b>120,000₮</b></div><div><span>2-р төлөлт</span><b>120,000₮</b></div><div class="now"><span>3-р төлөлт · 10/22</span><b>120,000₮</b></div><div><span>4-р төлөлт</span><b>120,000₮</b></div></div></div>
<span class="cap">placeholder copy</span>'''
B = '''<div class="nav"><span class="logo">BiD Pay</span><span class="navbtn">Апп татах</span></div>
<h4>Одоо ав.<br><span>4 хуваа.</span></h4><div class="phone"></div><div class="stick"><span><b>4×</b>хуваан<br>төл</span></div>
<span class="cta">Апп татах</span><span class="qr"></span><span class="cap">placeholder copy</span>'''
C = '''<div class="nav"><span class="logo">BiD Pay</span><span class="navbtn">Апп татах</span></div>
<h4>Одоо ав.<br><b>Дараа төл.</b></h4><p class="sub">Хуваан төлөх, хуримтлал, BiD debit карт. Бүгд нэг апп-д.</p><span class="cta">Апп татах</span>
<div class="glass"></div><div class="pane"><small>3-р төлөлт · 120,000₮</small><div class="bar4"><i class="on"></i><i class="on"></i><i></i><i></i></div><strong>Боломжит эрх 1,850,000₮</strong></div>
<span class="cap">placeholder copy</span>'''
D = '''<div class="photo"></div><div class="shade"></div><div class="nav"><span class="logo">BiD Pay</span><span class="navbtn">Апп татах</span></div>
<h4>Хүссэнээ<br>одоо ав.</h4><p class="sub">Төлбөрөө 4 хуваагаад, санаа амар төл.</p><span class="cta">Апп татах</span>
<span class="tag t1">4 хуваан төлөлт</span><span class="tag t2">BID shop</span>
<div class="buy"><small>BID shop · 480,000₮</small><strong>4 × 120,000₮</strong><div class="bar4"><i class="on"></i><i></i><i></i><i></i></div></div>
<span class="cap">photo goes here · placeholder copy</span>'''
directions = [
 dict(id=round2.E_DIR['id'], name=round2.E_DIR['name'], wide=True, pitch=round2.E_DIR['pitch'], **{'from': round2.E_DIR['frm']}, refs=round2.E_DIR['refs'], colour=round2.E_DIR['colour'], type=round2.E_DIR['type'], motion=round2.E_DIR['motion'], risk=round2.E_DIR['risk'], mock=round2.E_MOCK),
 dict(id='A', name='Clear Split', pitch='Light, calm and exact. The payment schedule is the hero image, so the product explains itself before anyone scrolls.',
      refs=['storepay', 'current', 'ramp', 'fruitful', 'sono', 'afterpay'], colour='App grey and white. Orange only on the action and the paid segments.',
      type='Geologica, medium weight, tight tracking. Large ₮ figures in tabular numerals.', motion='Segments fill one by one while the amounts count up. Nothing else moves.',
      risk='Can read as plain if the product UI is not drawn with real care.', mock=A),
 dict(id='B', name='Loud Orange', pitch='Orange from edge to edge and very heavy type. Built to be recognised in half a second and screenshotted by people under 30.',
      refs=['cashapp', 'tabby', 'uglycash', 'slush', 'headspace', 'atome'], colour='Orange floor to ceiling. Black and white on top, nothing else.',
      type='Unbounded Black for display, Geologica for reading. Badges set at an angle.', motion='Phone and stickers drift as you scroll. Buttons squash when pressed.',
      risk='Feels less like a licensed lender. Needs strong trust proof directly underneath.', mock=B),
 dict(id='C', name='Night Glass', pitch='Dark, glowing and dimensional. Positions BID Pay as the premium, technical choice, with the debit card as the hero object.',
      refs=['jeton', 'origin', 'zip', 'affirm', 'toki', 'mercury'], colour='Near-black with an orange glow. Frosted panels and thin white type.',
      type='Geologica Light at display size with one bold word. Mono for card numbers.', motion='The card tilts with the cursor. Sections pin and cross-fade on scroll.',
      risk='The heaviest to build, and the heaviest to load on mid-range Android phones.', mock=C),
 dict(id='D', name='Real People', pitch='Photography of customers and shops in Ulaanbaatar, with pieces of the app floating over the scene.',
      refs=['toki', 'revolut', 'afterpay', 'tamara', 'klarna', 'current'], colour='Warm photographs, white UI chips, orange for the action.',
      type='Geologica Semibold over the darkened edge of a photo.', motion='Slow parallax on the photo. Chips pop in one after another.',
      risk='Depends entirely on a real photo shoot. Stock photos will sink it.', mock=D),
]

# ---------------- section patterns ----------------
sections = [
 dict(id='hero', name='Hero', note='The first screen. It sets the tone for everything after it.', opts=[
  dict(id='split', name='Claim on the left, product on the right', seen='StorePay, MonPay, Hipay, Zip', wf='T:7,22,36,9|T:7,34,28,9|t:7,50,30,3|b:7,60,14,8|g:23,60,14,8|c:56,14,36,72|s:60,34,28,4|t:60,46,20,3|t:60,54,24,3|t:60,62,18,3'),
  dict(id='photo', name='Full-screen photo with app UI on top', seen='Toki, Revolut, Afterpay, Klarna', wf='i:0,0,100,100|T:7,30,34,9|T:7,42,24,9|b:7,60,14,8|c:62,48,30,38|s:66,62,22,4'),
  dict(id='type', name='Giant centred type over the phone', seen='Uglycash, Tamara, Tabby, Sono', wf='T:14,12,72,11|T:24,27,52,11|b:42,45,16,7|p:38,58,24,50'),
  dict(id='colour', name='One colour, one phone', seen='Cash App, Jeton', wf='a:0,0,100,100|d:7,38,26,8|d:7,50,18,8|p:39,14,22,100|d:70,44,18,3|d:70,51,14,3')]),
 dict(id='download', name='Getting the app', note='Most desktop visitors cannot install from where they are sitting. How do they reach the store?', opts=[
  dict(id='qr', name='QR code in the first screen', seen='Klarna, Afterpay, Tabby, Tamara, Atome, CRED, Alif', wf='T:7,26,34,9|t:7,42,28,3|c:60,22,30,56|q:67,30,16,26|t:65,62,20,3|t:68,69,14,3'),
  dict(id='badges', name='Store badges under the headline', seen='MonPay, Jeton, Toki', wf='T:7,26,34,9|t:7,42,28,3|d:7,56,13,8|d:22,56,13,8|d:37,56,13,8|p:66,14,20,100'),
  dict(id='sms', name='Phone-number field, link sent by SMS', seen='Current. Needs an SMS gateway.', wf='T:7,26,34,9|t:7,42,28,3|c:7,56,30,9|b:38,56,13,9|i:60,14,32,72')]),
 dict(id='split', name='Explaining the split', note='The core of the page. How do four payments get understood in five seconds?', opts=[
  dict(id='steps', name='Three steps with phone screens', seen='StorePay, Uglycash, Hipay', wf='T:30,8,40,7|p:12,24,20,54|p:40,24,20,54|p:68,24,20,54|t:13,84,18,3|t:41,84,18,3|t:69,84,18,3'),
  dict(id='timeline', name='The payment bar as a timeline', seen="Tabby, Zip, and BID Pay's own app", wf='T:7,14,40,8|t:7,28,30,3|s:7,48,86,7|n:7,62,12,5|n:29,62,12,5|t:51,62,12,5|t:73,62,12,5|t:7,72,10,3|t:29,72,10,3|t:51,72,10,3|t:73,72,10,3'),
  dict(id='calc', name='Live calculator: type a price, see the payments', seen='bid.mn has one for loans', wf='T:7,16,32,8|t:7,30,28,3|t:7,37,22,3|c:50,12,42,76|i:54,20,34,10|s:54,40,34,5|n:54,54,16,7|t:54,68,26,3|b:54,76,34,8')]),
 dict(id='proof', name='Proof', note='BID Pay is new. What makes a first-time visitor trust it?', opts=[
  dict(id='numbers', name='Row of numbers under the hero', seen='StorePay, Toki, Sono, Zeel, Slash, Klarna', wf='T:7,14,30,8|b:7,28,13,7|n:7,52,16,10|n:36,52,16,10|n:65,52,16,10|t:7,66,14,3|t:36,66,14,3|t:65,66,14,3'),
  dict(id='logos', name='Wall of merchant logos', seen='Hipay, Current, Titan, Headspace', wf='T:30,10,40,7|o:8,34,9,14|o:24,34,9,14|o:40,34,9,14|o:56,34,9,14|o:72,34,9,14|o:16,60,9,14|o:32,60,9,14|o:48,60,9,14|o:64,60,9,14|o:80,60,9,14'),
  dict(id='ratings', name='Store ratings and customer quotes', seen='Tabby, Zip, Lunar, CRED, Copilot Money', wf='n:8,16,20,10|t:8,30,16,3|n:40,16,20,10|t:40,30,16,3|c:8,46,26,42|c:37,46,26,42|c:66,46,26,42|t:11,54,18,3|t:40,54,18,3|t:69,54,18,3')]),
 dict(id='features', name='Everything else in the app', note='Payments, savings, shop, debit card, tiers. How much of it, and in what shape?', opts=[
  dict(id='bento', name='Grid of cards in mixed sizes', seen='Toki, Tamara, Apple Card, MetaMask', wf='c:6,10,42,46|c:52,10,42,22|c:52,36,20,20|c:74,36,20,20|c:6,60,28,30|c:38,60,56,30|T:10,16,20,5|T:56,15,18,5|i:10,26,34,24'),
  dict(id='rows', name='Alternating picture and text rows', seen='StorePay, Tabby, Current', wf='i:6,8,38,36|T:52,14,30,6|t:52,26,36,3|t:52,33,30,3|T:6,60,30,6|t:6,72,36,3|t:6,79,30,3|i:56,54,38,36'),
  dict(id='pinned', name='Pinned phone, captions scroll past', seen='Zip, Fruitful, Klarna, Toss, Sezzle', wf='p:38,6,24,100|T:6,24,24,6|t:6,36,22,3|t:6,43,18,3|T:70,56,24,6|t:70,68,22,3|t:70,75,18,3')]),
 dict(id='twoapps', name='BiD and BID Pay', note='The older BiD app stays live. Visitors need to know which one is theirs.', opts=[
  dict(id='strip', name='Thin notice bar at the very top', seen='Ramp, Headspace and Slush use this strip for announcements', wf='a:0,0,100,9|d:30,3,40,3|T:7,30,36,9|t:7,46,28,3|b:7,58,14,8|p:66,22,20,100'),
  dict(id='cards', name='Two cards side by side', seen='Closest match: the Business / Personal switch on Fluz, Zip and Klarna', wf='T:28,8,44,7|c:8,24,40,64|c:52,24,40,64|a:12,32,8,12|d:56,32,8,12|T:12,52,24,5|T:56,52,24,5|t:12,62,30,3|t:56,62,30,3|t:12,69,26,3|t:56,69,26,3|b:12,78,14,6|g:56,78,14,6'),
  dict(id='faq', name='One answer in the FAQ', seen='The quietest option. Tamara and Headspace keep an FAQ above the footer', wf='T:7,10,30,7|c:7,26,86,14|c:7,44,86,14|c:7,62,86,14|t:11,31,40,3|t:11,49,34,3|t:11,67,44,3|o:86,29,4,7|o:86,47,4,7|o:86,65,4,7')]),
 dict(id='close', name='Closing call to action', note='The last screen before the footer.', opts=[
  dict(id='dark', name='Dark band with phone and store badges', seen='Toki', wf='d:0,0,100,100|a:8,30,30,8|c:8,48,13,8|c:23,48,13,8|p:62,12,20,100'),
  dict(id='orange', name='Full orange band with a QR code', seen='Tabby, MetaMask, Lunar', wf='a:0,0,100,100|d:8,26,40,9|d:8,40,28,9|c:66,22,24,56|q:70,28,16,26|t:70,60,16,3'),
  dict(id='card', name='Rounded card floating above the footer', seen='Affirm, Current', wf='c:6,12,88,56|T:12,24,34,8|t:12,38,26,3|b:12,48,14,8|i:60,20,28,40|t:6,80,14,3|t:26,80,14,3|t:46,80,14,3|t:66,80,14,3')]),
]

findings = [
 dict(h='Orange is unclaimed at home', p='StorePay and MonPay are blue, Pocket and Hipay pink-red, Sono purple, Simple teal, Toki blue and black. <b>No local competitor owns orange.</b> The brands people remember abroad commit to one colour across the whole first screen: Cash App green, Tabby mint, Atome yellow, Zip purple.'),
 dict(h='Nobody local shows the split', p='The product is paying in parts, yet no Mongolian site draws it. StorePay comes closest with three phone screens. Zip says it in one line: split big payments into not-so-big ones. <b>The app already has a four-segment payment bar. Make it the signature of the page.</b>'),
 dict(h='Global BNPL puts a QR code in the first screen', p='Klarna, Afterpay, Tabby, Tamara and Atome all show a scannable Get-the-app code before you scroll. Local sites use a download button or store badges instead. For an app-only product, <b>a hero QR is the cheapest conversion win on the page.</b>'),
 dict(h='Proof sits directly under the button', p='StorePay: 680,000+ users, 9,000+ merchants. Toki: 1.5 million users. Tabby and Zip lead with store ratings, Current with press logos. BID Pay is new, so <b>borrow BID’s record</b>: licensed since 2005, plus merchant and customer counts if they can be published.'),
 dict(h='Two camps: people or product', p='Toki, Revolut, Afterpay and Current open on a person. Cash App, Zip, Uglycash and Origin open on the phone screen itself. Much of local fintech sits in a weaker third camp: <b>a generic phone render beside a slogan</b> (Hipay, MonPay, Simple).'),
 dict(h='Two apps need one clear sentence', p='BiD stays live beside BID Pay, and bid.mn is the lender’s loan-calculator site. Visitors will ask which app they need. None of the references had to solve this, so it has <b>its own row under Section by section.</b>'),
]

findings = findings + round2.FINDINGS2
DATA = dict(
 lede='51 live sites, captured and compared: Mongolian competitors, pay-later brands abroad, premium fintech, and the sites Mobbin curates for landing-page craft. Mark what you like. The page gets built from your picks.',
 findSub='Round one, 22 November 2026: 29 sites. Round two, the same day: 22 more, chosen around your first picks. The last two findings are new.',
 refSub='Round two adds 22 sites picked around what you loved: dark first screens, glass and 3D objects, bold type, pay-later sites written in Cyrillic, and four more local apps. Open any card to scroll the whole page and see the phone view.',
 dirH='Directions, and your mix so far',
 dirSub='Sketches in BID Pay orange. Copy and numbers are placeholders. The first card is new: it combines the direction and the section patterns you picked in round one.',
 foot='Captures: desktop at 1440 px and phone at 390 px, taken 22 November 2026 with a headless browser. Animated sites are stitched from scroll frames, so a few sections appear mid-transition. Mobbin picks and tags come from Mobbin’s public Sites pages (category, section and style listings); the full Mobbin library needs a login. Premium fintech, BNPL abroad and Mongolian sites were chosen and tagged by Claude. Screenshots belong to their owners and are kept here for internal reference only. Sketch copy and amounts are placeholders.',
 findings=findings, directions=directions, sections=sections, refs=R)

tpl = open(os.path.join(S, 'tools', 'template.html'), encoding='utf-8').read()
tpl = tpl.replace(".mock * { position: absolute }", ".mock > * { position: absolute }")
assert '/*__DATA__*/null' in tpl
html = tpl.replace('/*__DATA__*/null', json.dumps(DATA, ensure_ascii=False).replace('</', '<\\/'))
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(html)
json.dump(DATA['refs'], open(os.path.join(OUT, 'references.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('refs', len(R), 'html', len(html) // 1024, 'KB')
for r in R:
    if r['id'] in MOBNAME: print(' ', r['id'], r['tags'], r.get('mobbin', '')[-20:] if r.get('mobbin') else 'NO LINK')
