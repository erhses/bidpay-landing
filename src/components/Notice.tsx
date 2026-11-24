import { links, notice } from '@/content/site';

/** Thin bar that points people looking for the older BiD app to bid.mn. */
export default function Notice() {
  return (
    <div className="strip">
      <a href={links.bid} target="_blank" rel="noopener">
        {notice.before}
        <u>{notice.link}</u>
        {notice.after}
      </a>
    </div>
  );
}
