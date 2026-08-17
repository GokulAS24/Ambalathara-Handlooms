import { ContactSection } from '@/components/site/ContactSection';
import { MainHero } from '@/components/site/MainHero';
import { Navbar } from '@/components/site/Navbar';
import { ProductsSection } from '@/components/site/ProductsSection';
import { ServicesSection } from '@/components/site/ServicesSection';

/**
 * The full site LaunchGate swaps in once the countdown completes. Normal
 * document flow on purpose — no ViewportFit, no vh-clamped fluid tokens;
 * those exist specifically for the countdown page's one-screen budget, and
 * this page is meant to scroll. BackgroundPatterns (fixed, viewport-
 * covering) stays mounted by app/page.tsx above LaunchGate, so the same
 * ambient cloth ground carries through underneath this too.
 */
export function MainSite() {
  return (
    <main className="relative w-full">
      <Navbar />
      <MainHero />
      <ServicesSection />
      <ProductsSection />
      <ContactSection />
    </main>
  );
}

export default MainSite;
