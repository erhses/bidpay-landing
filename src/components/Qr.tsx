import QRCode from 'qrcode';

/** A scannable QR code, drawn as SVG on the server so it needs no script in the browser. */
export default async function Qr({ value, label }: { value: string; label: string }) {
  const svg = await QRCode.toString(value, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#16181d', light: '#ffffff' },
  });
  return <div className="code" role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: svg }} />;
}
