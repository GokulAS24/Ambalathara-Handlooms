import { cn } from '@/lib/utils';
import type { Product } from '@/types';

/**
 * Fabric-tinted swatch, standing in for real photography until it exists
 * (see supabase/migrations/0002_seed.sql — every seed item ships with an
 * empty `image`). Deliberately reads as a
 * textile swatch, not a broken image — a soft diagonal gradient in the
 * fabric's own theme colour plus a faint weave hatch, with the fabric name
 * set the way a garment label would. Shared across every card/preview/
 * viewer so all placeholders stay visually identical.
 *
 * Takes `fabric` directly rather than a whole `Product` — fabric lives on
 * the product, not the item, so item-level callers (an individual priced
 * image, which has no fabric of its own) pass their parent product's.
 */
const FABRIC_TINT: Record<Product['fabric'], string> = {
  kasavu: 'linear-gradient(135deg, rgba(197,160,89,0.35), rgba(220,192,138,0.55) 45%, rgba(110,82,32,0.3))',
  cotton: 'linear-gradient(135deg, rgba(242,223,204,0.9), rgba(236,214,191,0.7) 45%, rgba(212,185,157,0.55))',
  silk: 'linear-gradient(135deg, rgba(107,23,36,0.22), rgba(220,192,138,0.4) 45%, rgba(76,15,25,0.28))',
  linen: 'linear-gradient(135deg, rgba(92,74,61,0.18), rgba(242,223,204,0.75) 45%, rgba(212,185,157,0.5))',
};

const HATCH =
  'repeating-linear-gradient(45deg, rgba(46,42,38,0.05) 0px, rgba(46,42,38,0.05) 1px, transparent 1px, transparent 10px)';

export function ProductSwatch({
  fabric,
  className,
}: {
  fabric: Product['fabric'];
  className?: string;
}) {
  return (
    <div
      className={cn('relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden', className)}
      style={{ backgroundImage: `${HATCH}, ${FABRIC_TINT[fabric]}` }}
    >
      <span className="rounded-full border border-gold/50 bg-cream-100/70 px-4 py-1 font-sans text-[0.65rem] uppercase tracking-[0.3em] text-earth/90">
        {fabric}
      </span>
    </div>
  );
}

export default ProductSwatch;
