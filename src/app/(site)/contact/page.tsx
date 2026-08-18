import { Mail, MapPin, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getSiteData } from "@/lib/data/site";
import { getPageBySlug } from "@/lib/actions/pages.actions";

export default async function ContactPage() {
  const [{ settings }, page] = await Promise.all([getSiteData(), getPageBySlug("contact")]);
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to get in touch.")}`;
  const intro = page?.sections[0];

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Get in Touch</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">{page?.title ?? "Contact Us"}</h1>
        {intro?.body && <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-clay-500">{intro.body}</p>}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-sm border border-clay-200 px-4 py-6 text-center transition-colors hover:border-[#25D366]">
          <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
          <span className="text-sm font-medium text-clay-800">WhatsApp Us</span>
        </a>
        {settings.phoneNumbers[0] && (
          <a href={`tel:${settings.phoneNumbers[0].number}`} className="flex flex-col items-center gap-2 rounded-sm border border-clay-200 px-4 py-6 text-center transition-colors hover:border-clay-800">
            <Phone size={22} className="text-clay-700" strokeWidth={1.75} />
            <span className="text-sm font-medium text-clay-800">Call Us</span>
            <span className="text-xs text-clay-400">{settings.phoneNumbers[0].number}</span>
          </a>
        )}
        {settings.emails[0] && (
          <a href={`mailto:${settings.emails[0].email}`} className="flex flex-col items-center gap-2 rounded-sm border border-clay-200 px-4 py-6 text-center transition-colors hover:border-clay-800">
            <Mail size={22} className="text-clay-700" strokeWidth={1.75} />
            <span className="text-sm font-medium text-clay-800">Email Us</span>
            <span className="text-xs text-clay-400">{settings.emails[0].email}</span>
          </a>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-clay-400">
        <MapPin size={14} />
        {settings.address}
      </div>
    </div>
  );
}
