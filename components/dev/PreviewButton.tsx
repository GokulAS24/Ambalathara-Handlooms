'use client';

/**
 * ============================================================
 *  TEMPORARY — DEVELOPMENT ONLY. SAFE TO DELETE.
 * ============================================================
 * Lets you jump straight to the post-countdown flow (LogoReveal ->
 * MainSite) without waiting for the real launch date. Already excluded
 * from production builds (LaunchGate only renders it when
 * `process.env.NODE_ENV === 'development'`), so this is a manual-removal
 * convenience, not a production safety net.
 *
 * To remove entirely: delete this file, and in
 * components/layout/LaunchGate.tsx remove the `PreviewButton` import and
 * its one conditional render block (also clearly marked TEMPORARY there).
 */
export function PreviewButton({ onPreview }: { onPreview: () => void }) {
  return (
    <button
      type="button"
      onClick={onPreview}
      className="fixed left-3 top-3 z-[999] rounded-sm border border-gold/60 bg-cream-100/95 px-3 py-1.5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.15em] text-maroon shadow-loom backdrop-blur-sm transition-colors hover:bg-cream-100"
    >
      Preview Website
    </button>
  );
}

export default PreviewButton;
