import { getApp, qrTarget } from '@/content/site';
import Qr from './Qr';
import { Lines } from './SectionHead';

/** Closing panel: the QR code on a computer, the two store links everywhere. */
export default function Download() {
  return (
    <section className="get" id="tatah">
      <div className="wrap">
        <div className="panel" data-rv="">
          <div>
            <h2>
              <span className="d-only">
                <Lines of={getApp.titleDesktop} />
              </span>
              <span className="m-only">{getApp.titleMobile}</span>
            </h2>
            <p>{getApp.text}</p>
            <div className="stores">
              {getApp.stores.map((store) => (
                <a className="store" href={store.href} target="_blank" rel="noopener" key={store.name}>
                  <small>{store.device}</small>
                  {store.name}
                </a>
              ))}
            </div>
          </div>
          <div className="bigqr">
            <Qr value={qrTarget} label={getApp.qrLabel} />
            {getApp.qrCaption}
          </div>
        </div>
      </div>
    </section>
  );
}
