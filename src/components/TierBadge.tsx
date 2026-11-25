/**
 * A customer tier badge: the app's own badge artwork (originals in research/assets/tier-*.png, trimmed copies in
 * public/img/tiers/). Replace those files to update the badges.
 */
const TIERS = {
  standard: { w: 518, h: 669 },
  bronze: { w: 566, h: 650 },
  silver: { w: 567, h: 650 },
  gold: { w: 564, h: 654 },
} as const;

export type Tier = keyof typeof TIERS;

export default function TierBadge({ tier, title }: { tier: Tier; title: string }) {
  const { w, h } = TIERS[tier];
  return <img className="badge" src={`/img/tiers/${tier}.webp`} alt={title} width={w} height={h} loading="lazy" decoding="async" />;
}
