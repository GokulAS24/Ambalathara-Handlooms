import { Mail, MapPin, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getSiteData } from "@/lib/data/site";
import { getPageBySlug } from "@/lib/actions/pages.actions";

export default async function SupportPage() {
  const [{ settings }, page] = await Promise.all([getSiteData(), getPageBySlug("support")]);
  const primaryPhone = settings.phoneNumbers[0]?.number;
  const primaryEmail = settings.emails[0]?.email;
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi, I need help with my order.")}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">We&apos;re Here for You</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">{page?.title ?? "Customer Support"}</h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-clay-500">
          Our team is available 24×7 on WhatsApp for order help, sizing questions, or anything else you need.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-sm border border-clay-200 px-4 py-6 text-center transition-colors hover:border-[#25D366]">
          <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
          <span className="text-sm font-medium text-clay-800">WhatsApp Us</span>
          <span className="text-xs text-clay-400">Fastest response, 24×7</span>
        </a>

        {primaryPhone && (
          <a href={`tel:${primaryPhone}`} className="flex flex-col items-center gap-2 rounded-sm border border-clay-200 px-4 py-6 text-center transition-colors hover:border-clay-800">
            <Phone size={22} className="text-clay-700" strokeWidth={1.75} />
            <span className="text-sm font-medium text-clay-800">Call Us</span>
            <span className="text-xs text-clay-400">{primaryPhone}</span>
          </a>
        )}

        {primaryEmail && (
          <a href={`mailto:${primaryEmail}`} className="flex flex-col items-center gap-2 rounded-sm border border-clay-200 px-4 py-6 text-center transition-colors hover:border-clay-800">
            <Mail size={22} className="text-clay-700" strokeWidth={1.75} />
            <span className="text-sm font-medium text-clay-800">Email Us</span>
            <span className="text-xs text-clay-400">{primaryEmail}</span>
          </a>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-clay-400">
        <MapPin size={14} />
        {settings.address}
      </div>

      {page && page.sections.length > 0 && (
        <div className="mt-16 border-t border-clay-100 pt-10">
          <h2 className="text-center font-serif text-2xl text-clay-800">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            {page.sections.map((section) => (
              <div key={section.id} className="border-b border-clay-100 pb-6">
                {section.heading && <h3 className="text-[15px] font-medium text-clay-800">{section.heading}</h3>}
                {section.body && <p className="mt-2 text-sm leading-relaxed text-clay-500">{section.body}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
