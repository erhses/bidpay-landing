import { split } from '@/content/site';
import SectionHead from './SectionHead';

/**
 * How split payment works, as three steps with one still each: choose, split, pay piece by piece.
 * Deliberately no amounts and no number of payments; the stills show the idea, the app shows the offer.
 */
export default function Split() {
  const last = split.steps.length - 1;
  return (
    <section className="sec" id="huvaan">
      <div className="wrap">
        <SectionHead step={1} name={split.name} title={split.title} lede={split.lede} />
        <ol className="how">
          {split.steps.map((step, i) => (
            <li key={step.title} data-rv="">
              <div className="pic">
                <div className="plate">
                  <img src={step.image} alt={step.alt} width={1200} height={900} loading="lazy" />
                </div>
                {i < last ? (
                  <span className="next" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
              <span className="mono">{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
