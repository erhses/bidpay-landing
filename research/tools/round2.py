# Round-two references, chosen around the user's first picks (direction C; loved Origin, Revolut, StorePay, Toki, Uglycash).
def add(ref):
    # ---------- premium fintech ----------
    ref('cred', 'CRED', 'https://cred.club', 'craft',
        'Indian credit-card rewards club. Pure black, lowercase serif, and a QR code in the first screen. The closest thing to Night Glass that already exists.',
        ['Download QR card in the corner of a fully dark hero', 'A paragraph that lights up word by word as you scroll', 'Neon-lit product tiles on black, one glow colour per feature', 'Ratings as giant numerals: 4.8 and 4.8'],
        ['Members-only tone (“not everyone gets it”) is wrong for a product that wants everyone', 'Low-contrast grey body text on black'], ['dark', 'typography', '3d', 'scroll effects'], rnd=2)
    ref('robinhoodgold', 'Robinhood Gold Card', 'https://robinhood.com/creditcard/', 'craft',
        'One gold card standing in a pool of light, and a thin serif headline. The card is the whole hero.',
        ['A single 3D card as the hero object: the BiD debit card could play this part', 'Light that fades from black into a warm glow behind the object', 'Three plain facts in a row under the fold', 'Wordmark filling the footer'],
        ['Serif plus gold says exclusive. BID Pay needs to feel reachable'], ['dark', '3d', 'minimal'], rnd=2)
    ref('lunar', 'Lunar', 'https://www.lunar.app/en/personal', 'craft',
        'Danish neobank. Dim evening photo, a glass tablet floating beside the person, three benefits with icons, green button.',
        ['A glass 3D object layered into a real photograph', 'Three one-line benefits in the hero instead of a paragraph', 'Trustpilot and App Store ratings right under the button', 'Closing band in the brand colour with a QR code'],
        ['Switches between dark, white and green sections, so the mood breaks'], ['dark', 'photography', '3d', 'glass'], rnd=2)
    ref('atlas', 'Atlas Card', 'https://atlascard.com', 'craft',
        'Invite-only charge card. A glass card over a fogged city, then full-screen photographs with a single line of small text each.',
        ['Glass card floating over a city: the Ulaanbaatar skyline could do the same job', 'Cinematic full-width photos with almost no words', 'Restraint: one typeface, one size, a lot of black'],
        ['So quiet it explains nothing about the product', 'Luxury-only audience'], ['dark', 'photography', 'glass', 'minimal'], rnd=2)
    ref('wealthsimple', 'Wealthsimple', 'https://www.wealthsimple.com/en-ca', 'craft',
        'Canadian investing app. Navy hero with a slowly turning gold coin, then one sculpted 3D object per product.',
        ['One 3D object per feature: coin, card, mountain, pie', 'Product list set as five very large words', 'Email field in the hero', 'Closing proof line: trusted by over 4 million Canadians'],
        ['Alternates dark and cream sections'], ['dark', '3d', 'typography'], rnd=2)
    ref('applecard', 'Apple Card', 'https://www.apple.com/apple-card/', 'craft',
        'Pastel gradient, a phone rising from the bottom edge, and a grid of tiles where two or three huge words do all the talking.',
        ['Tiles with one claim each in very large type: No fees. Not even hidden ones.', 'Gradient as a brand surface instead of a flat colour', 'The physical card gets its own dark, dramatic tile'],
        ['Light and pastel: borrow the tile system, not the palette'], ['light', 'colorful', 'minimal', '3d'], rnd=2)
    ref('copilot', 'Copilot Money', 'https://www.copilot.money', 'craft',
        'Budgeting app and Apple Design Award finalist. Soft blue wash, a phone cropped by the bottom of the hero, three small proof chips.',
        ['Three proof chips under the subtitle: award, platforms, 4.8 stars', 'Phone cropped by the fold so the screen reads large', 'Each feature in its own softly tinted card with one line of copy', 'Ratings and reviews before the footer'],
        ['Light theme: use the structure, not the colour'], ['light', 'minimal', 'glass'], rnd=2)
    ref('toss', 'Toss', 'https://toss.im', 'craft',
        'Korea’s finance super-app. A rounded photo that cross-fades as you scroll, then phones on white with one short line each.',
        ['Hero photo inside a rounded frame, changing while the headline stays put', 'One sentence per feature: Send money in seconds', 'Super-app scope explained without a feature grid'],
        ['Very long, with little variation between sections'], ['photography', 'minimal', 'light', 'scroll effects'], rnd=2)
    # ---------- Mobbin picks ----------
    ref('slash', 'Slash', 'https://www.slash.com', 'mobbin',
        'Business banking. Black, a card set into dark stone, serif headlines with one italic word, and a gold stats row.',
        ['Photographed 3D card as the hero image', 'Rating chip above the headline: 4.8 stars', 'Four gold numbers in a row on black', 'One italic word per headline to break the seriousness'],
        ['B2B dashboard screenshots further down'], rnd=2)
    ref('discord', 'Discord', 'https://discord.com', 'mobbin',
        'Chat app. Indigo night sky, heavy capitals, and features shown in large rounded glass cards.',
        ['Glass cards with a thick translucent border, alternating left and right', 'All-caps headlines in a heavy weight, close to what you liked in Uglycash', 'Closing joke: YOU CAN’T SCROLL ANYMORE. BETTER GO CHAT.', 'Marquee band of single words'],
        ['The mascot characters are a brand of their own'], rnd=2)
    ref('framer', 'Framer', 'https://www.framer.com', 'mobbin',
        'Website builder, not finance. Included for one thing: product UI framed by a glowing edge on pure black.',
        ['Glow outline around a UI panel: the Night Glass effect done cleanly', 'Logo row in white on black', 'Dense dark product sections that stay readable'],
        ['Tool-for-professionals density'], rnd=2)
    # ---------- BNPL abroad ----------
    ref('sezzle', 'Sezzle', 'https://sezzle.com', 'bnpl',
        'US BNPL. Dark violet with a glowing outlined button, three award laurels and three phones fanned across the fold.',
        ['Glow around the download button itself', 'Award laurels between the button and the phones', 'Pinned scenes that swap as you scroll: shop, play, earn'],
        ['Three-part headline tries to say everything at once', 'Long pinned sections with little on screen'], ['dark', 'colorful', '3d', 'scroll effects'], rnd=2)
    ref('zilch', 'Zilch', 'https://www.zilch.com/uk/', 'bnpl',
        'UK pay-over-time card. Mint ground and green type as tall as the screen, with a 3D ribbon wrapped around a phone.',
        ['Headline at poster size: three words fill the hero', 'Legal terms set small but right beside the claim', 'Grid of green tiles, each a short promise: No late fees. No jargon.', 'Marquee of the wordmark before the footer'],
        ['Mint green is theirs', 'The plans table adds length'], ['bold', 'colorful', '3d', 'typography'], rnd=2)
    ref('podeli', 'Podeli', 'https://podeli.ru', 'bnpl',
        'Alfa-Bank’s BNPL. A Cyrillic headline that states the offer outright: split the payment into 4 parts. Product photos sit on a pink card.',
        ['The offer as the headline, in heavy Cyrillic', 'Four small cards under the hero: nothing extra, the limit, 4 payments, 10,000+ products', 'Catalogue of what you can buy, right on the home page', 'Dark app band with a QR code', 'FAQ accordion'],
        ['Service-notice banner above the hero'], ['cyrillic', 'light', 'bold', 'photography'], rnd=2)
    ref('dolyame', 'Dolyame', 'https://dolyame.ru', 'bnpl',
        'T-Bank’s BNPL. Pink card hero with a 3D icon and a sharp line: postpone the payment, not the shopping.',
        ['Headline with a twist instead of a description', 'Three benefits in one row, icon above, no boxes', 'How-to-pay stepper beside a phone in a coloured circle', 'QR code inside a phone frame for the app section'],
        ['Store and product grids make it feel like a marketplace'], ['cyrillic', 'light', 'colorful', '3d'], rnd=2)
    ref('yandexsplit', 'Yandex Split', 'https://splitbnpl.yandex.ru', 'bnpl',
        'Yandex’s BNPL in one screen: a green band, the name, one sentence, then where you can use it. Nothing else.',
        ['One-sentence pitch: split the payment into parts with no overpayment', 'Partner list as the only content after the hero', 'Heavy geometric Cyrillic at display size'],
        ['Too bare to stand alone as BID Pay’s page'], ['cyrillic', 'light', 'minimal', 'bold'], rnd=2)
    ref('kaspi', 'Kaspi.kz', 'https://kaspi.kz/kz', 'bnpl',
        'Kazakhstan’s super-app and the regional benchmark for paying in instalments. App icon, name, one line, phone.',
        ['Hero built from the app icon itself', 'Claim of rank: super-app No. 1 in Kazakhstan', 'Products as a horizontal row of plain cards', 'Large QR code as the final section'],
        ['Catalogue-style product list with little visual craft'], ['cyrillic', 'light', 'minimal'], rnd=2)
    ref('alif', 'Alif', 'https://www.alif.uz', 'bnpl',
        'Uzbek fintech with instalment shopping. Mint card hero with store badges and a QR code side by side.',
        ['Store badges and QR together in the hero', 'Ring of 2,000+ service icons as a proof graphic', 'QR repeated at the close with ratings'],
        ['Green on mint is low contrast in places'], ['light', 'minimal'], rnd=2)
    # ---------- Mongolia ----------
    ref('ard', 'Ard', 'https://ard.mn/mn', 'mn',
        'Ard’s super-app. Photo hero, then black sections with a 3D phone, blue glass shards and a card floating on black.',
        ['A local site already doing dark with 3D objects: phone, shards, card', 'Card options shown as one white card on black', 'Photo bands between the dark sections'],
        ['English WELCOME TO ARD headline says nothing', 'Promo pop-up covers the page on arrival', 'Jumps between photo, black and white sections'], ['dark', 'photography', '3d'], rnd=2)
    ref('zeel', 'Zeel', 'https://www.zeel.mn', 'mn',
        'P2P lending app. Full-screen mountain video, a two-word promise, an outlined button, then black sections with three big numbers.',
        ['Cinematic nature video as the hero, close to Mercury and Origin', 'Three numbers on black: 90,000+, 480,000+, 53.5+ billion', 'Phone photographed on moss: the product in a real scene'],
        ['Thin outlined button is easy to miss', 'Short page with little explanation'], ['dark', 'photography', 'minimal'], rnd=2)
    ref('mbank', 'M bank', 'https://www.m-bank.mn', 'mn',
        'Mongolia’s digital bank. Teal gradient hero with a phone and card, then dark sections. The most polished bank site locally.',
        ['Gradient hero with a real phone and Visa card', 'Dark blocks for business features', 'Download section with a QR tile and store badges'],
        ['Rotating hero banner', 'Blog on the home page'], ['dark', 'colorful', '3d'], rnd=2)
    ref('netcapital', 'NetCapital', 'https://www.netcapital.mn/mn/', 'mn',
        'Lender behind NetPay. White page, a pill-shaped headline, and three photo cards for personal, business and savings.',
        ['Audience cards with real photos: personal, business, savings', 'Floating quick-links bar at the bottom of the hero', 'Dark band with a loan-card carousel'],
        ['Carousel hero', 'News section on the home page'], ['light', 'photography', 'minimal'], rnd=2)

E_MOCK = '''<div class="strip">BiD апп хайж байна уу? → bid.mn</div>
<div class="nav"><span class="logo">BiD Pay</span><span class="navbtn">Апп татах</span></div>
<h4>Одоо ав.<br><b>Дараа төл.</b></h4><p class="sub">Хүссэнээ өнөөдөр аваад, төлбөрөө 4 хуваан төл.</p>
<span class="cta">Апп татах</span><div class="qrc"><i></i><span>QR уншуулаад<br>татаарай</span></div>
<div class="stats"><span><b>2005</b>оноос тусгай зөвшөөрөлтэй</span><span><b>4×</b>хуваан төлөлт</span><span><b>000+</b>хамтрагч дэлгүүр</span></div>
<div class="pane"><small>BID shop · нийт дүн</small><strong>480,000₮</strong><div class="bar4"><i class="on"></i><i class="on"></i><i></i><i></i></div><div class="rows"><div><span>1-р төлөлт</span><b>120,000₮</b></div><div><span>2-р төлөлт</span><b>120,000₮</b></div><div class="now"><span>3-р төлөлт · 10/22</span><b>120,000₮</b></div><div><span>4-р төлөлт</span><b>120,000₮</b></div></div></div>
<span class="cap">placeholder copy</span>'''
E_DIR = dict(id='E', name='Your mix so far', wide=True,
    pitch='Night Glass with the section patterns you chose: claim on the left and product on the right, a QR code beside the button, the payment bar as a timeline, numbers underneath, and a thin bar that points BiD users to the right app.',
    frm='Built from round one: direction C, the seven section picks, and the five sites you loved.',
    refs=['origin', 'revolut', 'toki', 'storepay', 'uglycash', 'cred', 'slash', 'robinhoodgold'],
    colour='Near-black with one orange glow and frosted panels. Solid orange only on the paid segments and the top bar.',
    type='Geologica Light with one bold gradient word. Heavier, Uglycash-style capitals can carry section headlines further down.',
    motion='Phone or card stays pinned while feature captions scroll past. Segments light up in order.',
    risk='Still the heaviest option to build. Needs a lighter fallback for mid-range Android phones.', mock=E_MOCK)
FINDINGS2 = [
 dict(h='A dark first screen would be a local first', p='Toki, Ard, Zeel and M bank all turn black further down, but each opens on a bright photo or gradient. Abroad, CRED, Slash and Robinhood Gold open dark and put one lit object in the middle. <b>Night Glass in orange has no local lookalike.</b>'),
 dict(h='Cyrillic pay-later sites put the offer in the headline', p='Podeli: split the payment into 4 parts. Yandex Split: split the payment, no overpayment. Dolyame: postpone the payment, not the shopping. All three set it in <b>heavy geometric Cyrillic at poster size</b>, the closest type reference for Mongolian.'),
]
