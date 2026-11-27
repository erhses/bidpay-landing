import QRCode from 'qrcode';

const INK = '#16181d';
const LOGO = '/img/icon.webp';

/**
 * A scannable QR code with the BiD Pay icon in the middle, drawn as SVG on the server so it needs no script in the
 * browser. Error correction is set to high (H, about 30% of the code can be lost), the modules under the icon are left
 * out, and the icon covers well under that share, so the code still reads.
 */
export default async function Qr({ value, label }: { value: string; label: string }) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: 'H' });
  const n = modules.size;
  const dark = (r: number, c: number) => modules.get(r, c) === 1;

  // The three finder patterns are drawn as rounded eyes, not module by module.
  const eyes: [number, number][] = [[0, 0], [0, n - 7], [n - 7, 0]];
  const inEye = (r: number, c: number) => eyes.some(([er, ec]) => r >= er && r < er + 7 && c >= ec && c < ec + 7);

  // A clear square in the middle, an odd number of modules wide so it sits exactly on the centre.
  let hole = Math.round(n * 0.26);
  if (hole % 2 === 0) hole += 1;
  const h0 = (n - hole) / 2;
  const inHole = (r: number, c: number) => r >= h0 && r < h0 + hole && c >= h0 && c < h0 + hole;

  // Each dark module is a rounded square 0.92 wide with 0.2 corners: a 0.52 square stroked 0.4 wide with round joins,
  // which keeps the path short. Narrower gaps or rounder corners stopped some decoders reading it at some sizes.
  let d = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (dark(r, c) && !inEye(r, c) && !inHole(r, c)) d += `M${c} ${r}h.52v.52h-.52z`;
    }
  }

  const logo = hole - 1; // half a module of white all round
  const lx = h0 + 0.5;

  return (
    <div className="code" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${n} ${n}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <clipPath id="qr-logo">
            <rect x={lx} y={lx} width={logo} height={logo} rx={logo * 0.24} />
          </clipPath>
        </defs>
        <rect width={n} height={n} fill="#fff" />
        <path d={d} transform="translate(.24 .24)" fill={INK} stroke={INK} strokeWidth={0.4} strokeLinejoin="round" />
        {eyes.map(([r, c]) => (
          <g key={`${r}-${c}`} fill={INK}>
            <path
              fillRule="evenodd"
              d={`M${c + 2} ${r}h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z
                  M${c + 2.3} ${r + 1}h2.4a1.3 1.3 0 0 1 1.3 1.3v2.4a1.3 1.3 0 0 1-1.3 1.3h-2.4a1.3 1.3 0 0 1-1.3-1.3v-2.4a1.3 1.3 0 0 1 1.3-1.3z`}
            />
            <rect x={c + 2} y={r + 2} width={3} height={3} rx={0.9} />
          </g>
        ))}
        <image href={LOGO} x={lx} y={lx} width={logo} height={logo} clipPath="url(#qr-logo)" />
      </svg>
    </div>
  );
}
