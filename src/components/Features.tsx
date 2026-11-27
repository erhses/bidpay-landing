import type { CSSProperties } from 'react';
import { features } from '@/content/site';
import FeatureMotion from './FeatureMotion';
import SectionHead from './SectionHead';
import { cls } from '@/lib/format';
import TierSpot from './TierSpot';

/** Small line icons for the savings goals, one stroke weight. */
function GoalIcon({ kind }: { kind: 'trip' | 'phone' | 'group' | 'star' }) {
  const paths = {
    trip: <path d="M3.5 13.5l17-7.5-4.5 14-4.2-5.3-5.5 2.2 1.8-3.8z M11.8 14.7l8.7-8.7" />,
    phone: <><rect x="7" y="2.8" width="10" height="18.4" rx="2.4" /><path d="M10.6 5.8h2.8" /></>,
    group: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5c.7-3.2 3.1-5 6-5s5.3 1.8 6 5" /><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.6 14.8c1.8.6 3 2.2 3.4 4.7" /></>,
    star: <path d="M12 3.8l2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.6l-5 2.6.9-5.6-4-3.9 5.6-.8z" />,
  };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  );
}

/**
 * Section 3 earns trust: the licensed lender behind the app, then what you get in it, one full-width panel each.
 * BiD's services sit in a stack that turns over on its own; savings goals float and fill; the tier badge turns in a
 * spotlight. Each moves once it is on screen (FeatureMotion),
 * and all of it reads complete without script or with reduced motion.
 */
export default function Features() {
  const { services, savings, tiers } = features;
  return (
    <section className="sec alt" id="bolomj">
      <div className="wrap">
        <SectionHead step={2} name={features.name} title={[...features.title]} lede={features.lede} />
        <ul className="facts" data-rv="">
          {features.facts.map((f) => (
            <li key={f.big}>
              <b>{f.big}</b>
              {f.small}
            </li>
          ))}
        </ul>
        <div className="pillars">
          <article className="pillar wide" data-rv="">
            <div className="say">
              <h3>{services.title}</h3>
              <p>{services.text}</p>
            </div>
            <div className="stack" data-stack="">
              {services.tiles.map((t, i) => (
                <div className="svc" data-tone={t.tone} data-pos={i} key={t.id}>
                  <img src={`/img/bid/${t.id}.webp`} alt={t.name} height={65} />
                  <span>{t.line}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="pillar wide flip" data-rv="">
            <div className="say">
              <h3>{savings.title}</h3>
              <p>{savings.text}</p>
              <p className="fine">{savings.note}</p>
            </div>
            <div className="pots" data-play="">
              {savings.pots.map((g, i) => (
                <div className={cls('pot', 'reward' in g && 'reward')} style={{ '--i': i, '--fill': `${g.fill}%` } as CSSProperties} key={g.name}>
                  <i>
                    <GoalIcon kind={g.icon} />
                  </i>
                  <div>
                    <b>{g.name}</b>
                    <small>{g.sub}</small>
                  </div>
                  {'faces' in g ? (
                    <span className="faces" aria-hidden="true">
                      {g.faces.map((f) => (
                        <span key={f}>{f}</span>
                      ))}
                    </span>
                  ) : null}
                  <span className="grow" aria-hidden="true">
                    <em />
                  </span>
                  {'reward' in g ? (
                    <span className="plus" aria-hidden="true">
                      {savings.plus}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </article>
          <article className="pillar center" data-rv="">
            <div className="say">
              <h3>{tiers.title}</h3>
              <p>{tiers.text}</p>
            </div>
            <TierSpot list={tiers.list} />
          </article>
        </div>
      </div>
      <FeatureMotion />
    </section>
  );
}
