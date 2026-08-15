import { cn } from '@/lib/utils';

/**
 * Traditional divider: twin zari rules running out from a central lotus
 * medallion, flanked by temple triangles. Static SVG, no client JS.
 */
export function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex w-full items-center justify-center gap-4', className)} aria-hidden="true">
      <span className="zari-rule h-px flex-1 max-w-[9rem] sm:max-w-[14rem]" />

      <svg
        width="112"
        height="26"
        viewBox="0 0 112 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Left temple triangles */}
        <path
          d="M2 20 L9 10 L16 20 M18 20 L25 10 L32 20"
          stroke="rgba(197,160,89,0.7)"
          strokeWidth="1"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Central lotus medallion */}
        <g transform="translate(56 13)">
          <ellipse cx="0" cy="0" rx="4.5" ry="9" fill="rgba(107,23,36,0.12)" stroke="rgba(107,23,36,0.55)" strokeWidth="0.9" />
          <ellipse cx="0" cy="0" rx="9" ry="4.5" fill="none" stroke="rgba(197,160,89,0.75)" strokeWidth="0.9" />
          <ellipse
            cx="0"
            cy="0"
            rx="6.6"
            ry="6.6"
            fill="none"
            stroke="rgba(197,160,89,0.5)"
            strokeWidth="0.7"
            transform="rotate(45)"
          />
          <circle cx="0" cy="0" r="2" fill="rgba(197,160,89,0.95)" />
        </g>

        {/* Right temple triangles */}
        <path
          d="M80 20 L87 10 L94 20 M96 20 L103 10 L110 20"
          stroke="rgba(197,160,89,0.7)"
          strokeWidth="1"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Connecting threads */}
        <path d="M34 15 H45 M67 15 H78" stroke="rgba(197,160,89,0.55)" strokeWidth="0.9" />
      </svg>

      <span className="zari-rule h-px flex-1 max-w-[9rem] sm:max-w-[14rem]" />
    </div>
  );
}

export default OrnamentalDivider;
