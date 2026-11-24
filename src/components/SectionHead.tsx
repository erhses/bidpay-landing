import { Fragment } from 'react';

/** Lines of a heading, broken where the design breaks them. */
export function Lines({ of }: { of: string[] }) {
  return of.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ));
}

/**
 * Section heading. The marker is the app's own four-part payment bar; `step` says how many parts are filled,
 * so the four sections read as one, two, three and four of four.
 */
export default function SectionHead({ step, name, title, lede }: { step: 1 | 2 | 3 | 4; name: string; title: string[]; lede?: string }) {
  return (
    <div className="head" data-rv="">
      <span className="part">
        <i className="b4" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <b key={n} className={n <= step ? 'on' : undefined} />
          ))}
        </i>
        {name}
      </span>
      <h2>
        <Lines of={title} />
      </h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  );
}
