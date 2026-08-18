import { Star, StarHalf } from "lucide-react";

export default function StarRating({
  rating,
  reviewCount,
  size = 13,
  className,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const roundedFull = rating - full >= 0.75 ? full + 1 : full;
  const empty = 5 - roundedFull - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <div className="flex items-center text-brand-500">
        {Array.from({ length: roundedFull }).map((_, i) => (
          <Star key={`f-${i}`} size={size} fill="currentColor" strokeWidth={0} />
        ))}
        {hasHalf && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
        {Array.from({ length: Math.max(empty, 0) }).map((_, i) => (
          <Star key={`e-${i}`} size={size} className="text-clay-200" fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-clay-400">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  );
}
