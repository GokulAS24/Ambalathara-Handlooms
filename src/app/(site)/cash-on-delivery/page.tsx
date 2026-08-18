import { MessageCircle, PackageCheck, Wallet } from "lucide-react";
import { getSiteData } from "@/lib/data/site";

const steps = [
  { icon: MessageCircle, title: "Place your order", text: "Add items to your bag and confirm your order with us on WhatsApp — no advance payment needed." },
  { icon: PackageCheck, title: "We prepare & ship", text: "Your handloom pieces are packed with care and dispatched to your address." },
  { icon: Wallet, title: "Pay on delivery", text: "Pay the delivery agent in cash when your order arrives at your doorstep." },
];

export default async function CashOnDeliveryPage() {
  const { settings } = await getSiteData();
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hi, I have a question about Cash on Delivery.")}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Payments</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">Cash on Delivery</h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-clay-500">
          Prefer to pay in person? Cash on Delivery (COD) is available across India on all orders — pay only when your handloom pieces arrive.
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

      <div className="mt-14 flex flex-col items-center gap-4 rounded-sm bg-clay-50 px-6 py-10 text-center">
        <p className="text-[15px] text-clay-600">Have a question about paying on delivery? We&apos;re happy to help.</p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-clay-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-sand-50 transition-colors hover:bg-clay-800">
          Ask Us on WhatsApp
        </a>
      </div>
    </div>
  );
}
