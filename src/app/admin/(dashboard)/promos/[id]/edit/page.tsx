import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PromoForm from "../../PromoForm";
import { updatePromoBlock } from "@/lib/actions/promos.actions";

export default async function EditPromoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promo = await prisma.promoBlock.findUnique({ where: { id } });
  if (!promo) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Promo Block</h1>
      <PromoForm promo={promo} action={updatePromoBlock.bind(null, id)} />
    </div>
  );
}
