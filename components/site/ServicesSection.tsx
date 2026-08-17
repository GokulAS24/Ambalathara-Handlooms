'use client';

import { motion } from 'framer-motion';
import { Gift, Package, ScissorsLineDashed, Sparkles, Truck, Users } from 'lucide-react';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';

const SERVICES = [
  {
    icon: ScissorsLineDashed,
    title: 'Custom Weaving',
    description: 'Bespoke sarees and mundus woven to your chosen colours, border and measurements.',
  },
  {
    icon: Package,
    title: 'Bulk & Wholesale',
    description: 'Standing orders for boutiques, event organisers and retailers, at wholesale terms.',
  },
  {
    icon: Sparkles,
    title: 'Draping Guidance',
    description: 'Styling notes over a call or WhatsApp — how to drape, pair and care for each weave.',
  },
  {
    icon: Truck,
    title: 'Pan-India Shipping',
    description: 'Careful packaging and tracked courier delivery to every corner of the country.',
  },
  {
    icon: Users,
    title: 'Fabric Care & Restoration',
    description: 'Cleaning and preservation guidance to keep an heirloom weave in the family for years.',
  },
  {
    icon: Gift,
    title: 'Corporate & Festive Gifting',
    description: 'Curated handloom gift sets for weddings, festivals and corporate occasions.',
  },
] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ServicesSection() {
  return (
    <section id="services" className="w-full scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-xs uppercase tracking-zari text-gold-dark">What We Offer</h2>
          <p className="mt-3 font-serif text-3xl text-maroon sm:text-4xl">Services, Woven Around You</p>
          <OrnamentalDivider className="mx-auto mt-6 max-w-xs opacity-80" />
        </div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <motion.li
              key={service.title}
              variants={card}
              className="card-handloom flex flex-col gap-3 rounded-sm p-6 shadow-zari transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lg"
            >
              <service.icon className="h-7 w-7 text-maroon" aria-hidden />
              <h3 className="font-serif text-lg text-maroon">{service.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-earth">{service.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default ServicesSection;
