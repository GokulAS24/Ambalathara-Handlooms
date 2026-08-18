import PromoForm from "../PromoForm";
import { createPromoBlock } from "@/lib/actions/promos.actions";

export default function NewPromoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New Promo Block</h1>
      <PromoForm action={createPromoBlock} />
    </div>
  );
}
