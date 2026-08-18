import { RotateCcw, Truck, Gift } from "lucide-react";

const highlights = [
  { label: "Easy Returns", icon: RotateCcw },
  { label: "Fast Delivery", icon: Truck },
  { label: "Free Shipping", icon: Gift },
];

export default function HighlightBar() {
  return (
    <div className="border-b border-clay-100 bg-brand-50 md:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 py-2">
        {highlights.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-700"
          >
            <Icon size={13} strokeWidth={2.25} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
