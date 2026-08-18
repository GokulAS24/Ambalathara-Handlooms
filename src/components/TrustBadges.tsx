import Link from "next/link";
import { RotateCcw, IndianRupee, ChevronRight } from "lucide-react";

const badges = [
  { label: "10-Day Return", href: "/returns", icon: <RotateCcw size={22} strokeWidth={1.75} /> },
  { label: "Cash on Delivery", href: "/cash-on-delivery", icon: <IndianRupee size={22} strokeWidth={1.75} /> },
  { label: "Customer support", href: "/support", icon: <span className="text-sm font-black italic">24×7</span> },
];

export default function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-3 gap-1.5 border-t border-clay-100 pt-6 sm:gap-2">
      {badges.map((badge) => (
        <Link
          key={badge.label}
          href={badge.href}
          className="group flex flex-col items-center text-center"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-clay-50 text-clay-700 transition-colors group-hover:bg-clay-100 sm:h-14 sm:w-14">
            {badge.icon}
          </span>
          <p className="mt-2 flex items-center justify-center gap-0.5 text-xs leading-snug text-clay-700 transition-colors group-hover:text-brand-600 sm:text-sm">
            {badge.label}
            <ChevronRight size={14} className="hidden shrink-0 text-clay-400 sm:inline" />
          </p>
        </Link>
      ))}
    </div>
  );
}
