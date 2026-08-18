import { RotateCcw, PackageCheck, Banknote, XCircle } from "lucide-react";
import { getSiteData } from "@/lib/data/site";
import { getPageBySlug } from "@/lib/actions/pages.actions";

const steps = [
  { icon: RotateCcw, title: "Request within 10 days", text: "Message us on WhatsApp within 10 days of delivery with your order details and reason for return." },
  { icon: PackageCheck, title: "Pack it up", text: "Keep the item unused, unwashed, and in its original packaging with tags intact." },
  { icon: Banknote, title: "Get refunded", text: "Once we receive and inspect the item, your refund is processed within 5–7 business days." },
];

export default async function ReturnsPage() {
  const [{ settings }, page] = await Promise.all([getSiteData(), getPageBySlug("returns")]);
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi, I'd like to request a return.")}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Customer Care</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">{page?.title ?? "10-Day Return Policy"}</h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-clay-500">
          We want you to love what you weave into your wardrobe. If something isn&apos;t right, you can request a return within 10 days of delivery.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-clay-50 text-clay-700">
              <step.icon size={20} strokeWidth={1.75} />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-clay-800">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-clay-500">{step.text}</p>
          </div>
        ))}
      </div>

      {page && page.sections.length > 0 && (
        <div className="mt-14 border-t border-clay-100 pt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-clay-800">
            <XCircle size={16} className="text-clay-400" /> Additional Notes
          </h2>
          <div className="mt-4 space-y-3 text-sm text-clay-500">
            {page.sections.map((s) => (
              <p key={s.id}>{s.body}</p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-14 flex flex-col items-center gap-4 rounded-sm bg-clay-50 px-6 py-10 text-center">
        <p className="text-[15px] text-clay-600">Ready to start a return? Reach out with your order details and we&apos;ll take it from there.</p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-clay-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-sand-50 transition-colors hover:bg-clay-800">
          Start a Return on WhatsApp
        </a>
      </div>
    </div>
  );
}
