import { footer } from '@/content/site';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div>
          <a className="logo" href="#top">
            <img src="/img/icon.webp" alt="" width={32} height={32} />
            BiD Pay
          </a>
          <p>{footer.about}</p>
        </div>
        <ul>
          {footer.links.map((link) => (
            <li key={link.href}>
              {'external' in link ? (
                <a href={link.href} target="_blank" rel="noopener">
                  {link.label}
                </a>
              ) : (
                <a href={link.href}>{link.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
