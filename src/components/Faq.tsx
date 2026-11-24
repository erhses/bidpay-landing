import { faq } from '@/content/site';
import SectionHead from './SectionHead';

export default function Faq() {
  return (
    <section className="sec alt" id="asuult">
      <div className="wrap">
        <SectionHead step={4} name={faq.name} title={faq.title} />
        <div className="faq">
          {faq.items.map((item) => (
            <details data-rv="" key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
