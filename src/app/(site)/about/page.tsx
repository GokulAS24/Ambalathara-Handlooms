import { getPageBySlug } from "@/lib/actions/pages.actions";

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Our Story</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">{page?.title ?? "About Us"}</h1>
      </div>
      <div className="mt-10 flex flex-col gap-10">
        {page?.sections.map((section) => (
          <div key={section.id} className="text-center">
            {section.heading && <h2 className="font-serif text-2xl text-clay-800">{section.heading}</h2>}
            {section.body && <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-clay-500">{section.body}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
