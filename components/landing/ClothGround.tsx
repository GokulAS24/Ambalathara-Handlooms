'use client';

import { useEffect, useRef } from 'react';

/**
 * The page's ground, matched to the ground in the brand artwork.
 *
 * `public/ambalathara-logo.jpg` is a photograph, and it carries its own
 * backdrop: a warm blush field, lit behind the emblem and falling away to
 * tan at the corners, textured with a soft mosaic of irregular rectangles
 * under a fine paper grain. Against a flat page colour that backdrop reads
 * as a photo pasted onto the layout — which is what the edge feather in
 * DrapedLogo is currently working around.
 *
 * So the page grows the same ground. The vignette is CSS (`.cotton-glow`),
 * because it must be right on the first paint; this canvas adds the two
 * parts that CSS cannot do honestly:
 *
 *   1. the mosaic — genuinely irregular, so any repeating background-image
 *      shows its seam within a screen or two, and
 *   2. the grain — per-pixel, which no gradient stack reaches.
 *
 * Purely decorative: `aria-hidden`, never interactive.
 */

/**
 * Tint values sampled off the artwork itself.
 *
 * The ground runs #F2DFCC where it is lit to #D4B99D in the corners, a
 * spread of about 24 of 255. The mosaic accounts for only a few points of
 * that, which is why the alphas below stay under 0.05 — pushed further the
 * tiles stop reading as cloth and start reading as compression blocks.
 */
const TILE_LIGHT = '255, 248, 236';
const TILE_SHADE = '150, 118, 88';

/**
 * Seeded PRNG (Mulberry32).
 *
 * Not `Math.random`: the ground has to be identical across repaints, or a
 * resize would silently reshuffle the whole mosaic under the reader.
 */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rows of jittered height, each split into cells of jittered width, with the
 * row's starting offset jittered too. That last part is what stops the cells
 * lining up into columns — the artwork's tiles break joint like brickwork.
 */
function paintMosaic(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const random = mulberry32(0x9e3779b9);
  const unit = Math.max(width, height) / 13;

  // Softens the cell edges. Unsupported in older Safari, where the mosaic
  // simply renders crisp — at these alphas that degrades quietly.
  ctx.filter = 'blur(3px)';

  for (let y = -unit; y < height + unit; ) {
    const rowHeight = unit * (0.55 + random() * 0.9);
    let x = -unit * random();

    while (x < width + unit) {
      const cellWidth = unit * (0.5 + random() * 1.5);

      // Roughly a third of cells stay untinted, so the mosaic reads as
      // occasional patches rather than a fully tiled floor.
      if (random() > 0.35) {
        const alpha = 0.012 + random() * 0.032;
        const tint = random() > 0.5 ? TILE_LIGHT : TILE_SHADE;
        ctx.fillStyle = `rgba(${tint}, ${alpha})`;
        ctx.fillRect(x, y, cellWidth - 1, rowHeight - 1);
      }

      x += cellWidth;
    }

    y += rowHeight;
  }

  ctx.filter = 'none';
}

/**
 * Grain is built once into a small offscreen tile and repeated, rather than
 * written per-pixel across the viewport — the same look for a fraction of
 * the work. Lightening and darkening specks are drawn in equal measure so
 * the grain adds texture without shifting the ground's overall tone.
 */
function paintGrain(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const size = 96;
  const tile = document.createElement('canvas');
  tile.width = size;
  tile.height = size;

  const tileCtx = tile.getContext('2d');
  if (!tileCtx) return;

  const image = tileCtx.createImageData(size, size);
  const random = mulberry32(0x85ebca6b);

  for (let i = 0; i < image.data.length; i += 4) {
    const light = random() > 0.5;
    image.data[i] = light ? 255 : 120;
    image.data[i + 1] = light ? 248 : 96;
    image.data[i + 2] = light ? 236 : 70;
    image.data[i + 3] = Math.floor(random() * 16);
  }

  tileCtx.putImageData(image, 0, 0);

  const pattern = ctx.createPattern(tile, 'repeat');
  if (!pattern) return;

  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
}

export function ClothGround({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Tracked so a repaint can be skipped when nothing meaningful moved.
    let lastWidth = 0;
    let lastHeight = 0;
    let frame = 0;

    const paint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Capped at 2: past that the mosaic and grain cost more than they show.
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(ratio, ratio);
      paintMosaic(ctx, width, height);
      paintGrain(ctx, width, height);

      lastWidth = width;
      lastHeight = height;
    };

    const onResize = () => {
      // On mobile, showing and hiding the address bar fires resize constantly
      // while the width never changes. Repainting on that is wasted work and
      // visible as a flicker, so small height-only changes are ignored.
      const widthChanged = window.innerWidth !== lastWidth;
      const heightJumped = Math.abs(window.innerHeight - lastHeight) > 140;
      if (!widthChanged && !heightJumped) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

export default ClothGround;
