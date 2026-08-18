import { notFound } from "next/navigation";
import { getPageBySlug, createSection, updateSection, deleteSection, updatePageMeta } from "@/lib/actions/pages.actions";
import ImageUpload from "@/components/admin/ImageUpload";

export default async function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="mb-4 text-2xl font-semibold">{page.title}</h1>
        <form action={updatePageMeta.bind(null, page.id)} className="flex max-w-md gap-2">
          <input name="title" defaultValue={page.title} className="flex-1 border p-2" />
          <button type="submit" className="border px-3">Save Title</button>
        </form>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Sections</h2>
        <div className="flex flex-col gap-6">
          {page.sections.map((s) => (
            <form key={s.id} action={updateSection.bind(null, s.id)} className="flex flex-col gap-2 border p-4">
              <label className="text-sm">Type</label>
              <input name="type" defaultValue={s.type} className="border p-2" />
              <label className="text-sm">Heading</label>
              <input name="heading" defaultValue={s.heading ?? ""} className="border p-2" />
              <label className="text-sm">Body</label>
              <textarea name="body" defaultValue={s.body ?? ""} className="border p-2" />
              <ImageUpload name="imageUrl" defaultValue={s.imageUrl ?? undefined} label="Image" />
              <label className="text-sm">Order</label>
              <input name="order" type="number" defaultValue={s.order} className="border p-2" />
              <div className="flex gap-3">
                <button type="submit" className="bg-black px-3 py-1.5 text-sm text-white">Save</button>
                <button formAction={deleteSection.bind(null, s.id)} className="px-3 py-1.5 text-sm text-red-600">Delete</button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Add Section</h2>
        <form action={createSection.bind(null, page.id)} className="flex max-w-xl flex-col gap-2 border p-4">
          <input name="type" placeholder="Type (hero / text / faq / note)" required className="border p-2" />
          <input name="heading" placeholder="Heading" className="border p-2" />
          <textarea name="body" placeholder="Body" className="border p-2" />
          <ImageUpload name="imageUrl" label="Image" />
          <input name="order" type="number" placeholder="Order" className="border p-2" />
          <button type="submit" className="bg-black py-2 text-white">Add Section</button>
        </form>
      </section>
    </div>
  );
}
