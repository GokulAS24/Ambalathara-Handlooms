'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Footer } from '@/components/landing/Footer';
import { OrnamentalDivider } from '@/components/landing/OrnamentalDivider';
import { buttonClassName } from '@/components/ui/Button';
import { PHONE_URL, SITE_CONFIG, WHATSAPP_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ContactSection() {
  return (
    <section id="contact" className="w-full scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28">
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-sans text-xs uppercase tracking-zari text-gold-dark">Get in Touch</h2>
        <p className="mt-3 font-serif text-3xl text-maroon sm:text-4xl">We&apos;d Love to Hear From You</p>
        <p className="mt-4 font-sans text-sm leading-relaxed text-earth">
          Questions about a piece, a custom order, or a bulk enquiry — reach us directly, no forms to fill.
        </p>
        <OrnamentalDivider className="mx-auto mt-6 max-w-xs opacity-80" />
      </motion.div>

      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="card-handloom mx-auto mt-12 flex max-w-xl flex-col gap-4 rounded-sm p-6 shadow-zari sm:p-8"
      >
        <ContactRow icon={MapPin} label={SITE_CONFIG.established} />
        {SITE_CONFIG.contactEmail && (
          <ContactRow icon={Mail} label={SITE_CONFIG.contactEmail} href={`mailto:${SITE_CONFIG.contactEmail}`} />
        )}
        {PHONE_URL && <ContactRow icon={Phone} label="Call our studio" href={PHONE_URL} />}
        {WHATSAPP_URL && <ContactRow icon={MessageCircle} label="Message us on WhatsApp" href={WHATSAPP_URL} />}

        {(PHONE_URL || WHATSAPP_URL) && (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            {PHONE_URL && (
              <a href={PHONE_URL} className={cn(buttonClassName('primary', 'md'), 'flex-1 whitespace-nowrap')}>
                <Phone className="h-4 w-4" aria-hidden />
                Call Us
              </a>
            )}
            {WHATSAPP_URL && (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonClassName('ghost', 'md'), 'flex-1 whitespace-nowrap')}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            )}
          </div>
        )}
      </motion.div>

      <div className="mx-auto mt-20 max-w-md">
        <Footer />
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Phone;
  label: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0 text-gold-dark" aria-hidden />
      <span className="font-sans text-sm text-charcoal">{label}</span>
    </>
  );

  if (!href) {
    return <div className="flex items-center gap-3">{content}</div>;
  }

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 transition-colors duration-300 hover:text-maroon"
    >
      {content}
    </a>
  );
}

export default ContactSection;
