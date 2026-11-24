import { features } from '@/content/site';
import SectionHead from './SectionHead';

/** What else the app does, one card each, each with a still from the same 3D kit as the hero. */
export default function Features() {
  return (
    <section className="sec alt" id="bolomj">
      <div className="wrap">
        <SectionHead step={2} name={features.name} title={features.title} lede={features.lede} />
        <div className="cards">
          {features.cards.map((card) => (
            <article className="card" data-rv="" key={card.tag}>
              <div className="plate">
                <img src={card.image} alt="" width={1200} height={900} loading="lazy" />
              </div>
              <span className="mono">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
