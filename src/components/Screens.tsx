import { screens } from '@/content/site';
import SectionHead from './SectionHead';

export default function Screens() {
  return (
    <section className="sec" id="app">
      <div className="wrap">
        <SectionHead step={3} name={screens.name} title={screens.title} lede={screens.lede} />
        <div className="screens">
          {screens.items.map((item) => (
            <figure data-rv="" key={item.title}>
              <div className="phone">
                <img src={item.image} alt={item.alt} width={603} height={1311} loading="lazy" />
              </div>
              <figcaption>
                <span className="mono">{item.label}</span>
                <b>{item.title}</b>
                {item.text}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
