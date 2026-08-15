'use client';

import { MotionConfig } from 'framer-motion';

/**
 * `reducedMotion="user"` tells Framer Motion to skip transform and layout
 * animations for visitors whose OS asks for reduced motion, while still
 * allowing opacity to fade — so the page arrives calmly rather than not at
 * all. It reads the media query itself, which avoids the SSR/first-render
 * problem a hook-based gate would have.
 *
 * Wrapping at the root means every motion component on the page inherits
 * it; individual components never have to remember.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export default MotionProvider;
