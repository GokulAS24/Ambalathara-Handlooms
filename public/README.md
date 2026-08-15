# Static assets

## `ambalathara-logo.mp4` — the brand mark, animated

The hero's primary visual: the studio's own render of the mark — the red
"A" with the loom bar and warp threads, the AMBALATHARA wordmark, and a
kasavu saree draped across it — with the cloth in slow, continuous motion.
`DrapedLogo` plays it muted/looped/inline, feathered on every edge
(`EDGE_FEATHER`) so its rectangular frame dissolves into the page rather
than sitting on it like a video box. The source of truth lives in
[`/assets`](../assets); this is the copy Next.js serves.

H.264/AAC, 1920 × 1080, ~14s, ~7.6 MB. That's the largest asset on the
page by a wide margin, but it's a one-time download for a clip meant to
loop indefinitely, so the size trade is the right one here.

Requirements if you replace it:

- **The composition's extent drives the edge feather.** `EDGE_FEATHER` in
  `components/landing/DrapedLogo.tsx` was measured, not eyeballed: sample
  frames spread across the loop were diffed against a heavily blurred copy
  of themselves (the vignette alone is too close in colour to threshold
  against directly), and the union of what that flagged as content across
  every frame gives the mask's safe radius. A different composition —
  content sitting closer to the frame edge, say — needs that mask
  re-measured, or the feather will either clip the mark or leave a visible
  hard edge. The comment above `EDGE_FEATHER` has the exact measurements
  this file's mask was built from, as a reference for re-measuring.
- **Loop it clean.** The browser's native `loop` restarts instantly with no
  fade — this file's motion is a small settle-and-return sway, so the seam
  is already close to invisible. Footage that drifts further from where it
  started will read as a jump cut every ~14 seconds.
- **Roughly 16:9.** The container renders at `aspect-video`; the video fills
  it via `object-cover`, so a differently-shaped composition will crop.

Changing the filename means changing `BRAND_VIDEO_SRC` in `lib/constants.ts`.

## `ambalathara-logo.jpg` — the same mark, still

Used two ways: as the video's `poster` (what shows before playback starts)
and as the fallback `DrapedLogo` swaps in outright if the video ever fails
to load (`onError`) — so a missing or unsupported video never leaves a
blank box. Same source, same source-of-truth location in
[`/assets`](../assets).

4096 × 4096, ~2.4 MB — `next/image` resizes and re-encodes it to WebP/AVIF
at the width each device actually asks for.

Requirements if you replace it: **square** (the fallback path renders it at
`aspect-square`; a non-square file letterboxes) and **the same composition
as the video** — see the note above about `EDGE_FEATHER`, which is shared
by both.

Changing the filename means changing `BRAND_LOGO_SRC` in `lib/constants.ts`.
