export default function WeavePattern({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern
          id="weave-grid"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 4 H18" stroke="currentColor" strokeWidth="1" />
          <path d="M0 13 H18" stroke="currentColor" strokeWidth="1" />
          <path d="M4 0 V18" stroke="currentColor" strokeWidth="1" />
          <path d="M13 0 V18" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#weave-grid)" />
    </svg>
  );
}
