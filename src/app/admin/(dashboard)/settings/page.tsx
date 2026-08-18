import { getSiteSettings, updateSiteSettings, addPhoneNumber, deletePhoneNumber, addEmail, deleteEmail, addSocialLink, deleteSocialLink } from "@/lib/actions/settings.actions";
import ImageUpload from "@/components/admin/ImageUpload";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Site Settings</h1>

      <form action={updateSiteSettings} className="flex max-w-xl flex-col gap-3">
        <label className="text-sm">Site Name</label>
        <input name="siteName" defaultValue={settings.siteName} className="border p-2" />

        <label className="text-sm">Tagline</label>
        <input name="tagline" defaultValue={settings.tagline ?? ""} className="border p-2" />

        <ImageUpload name="logoUrl" defaultValue={settings.logoUrl} label="Logo (full lockup)" />
        <ImageUpload name="logoMarkUrl" defaultValue={settings.logoMarkUrl ?? undefined} label="Logo Mark (icon only)" />
        <ImageUpload name="faviconUrl" defaultValue={settings.faviconUrl ?? undefined} label="Favicon" />

        <label className="text-sm">Footer Text</label>
        <textarea name="footerText" defaultValue={settings.footerText} className="border p-2" />

        <label className="text-sm">Address</label>
        <textarea name="address" defaultValue={settings.address} className="border p-2" />

        <label className="text-sm">WhatsApp Number (international, no +)</label>
        <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="border p-2" />

        <button type="submit" className="mt-2 bg-black py-2 text-white">Save Settings</button>
      </form>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Phone Numbers</h2>
        <ul className="mb-3 flex flex-col gap-2">
          {settings.phoneNumbers.map((p) => (
            <li key={p.id} className="flex items-center gap-3 text-sm">
              {p.label}: {p.number}
              <form action={deletePhoneNumber.bind(null, p.id)}>
                <button type="submit" className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addPhoneNumber} className="flex gap-2">
          <input name="label" placeholder="Label" className="border p-2" required />
          <input name="number" placeholder="Number" className="border p-2" required />
          <button type="submit" className="border px-3">Add</button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Emails</h2>
        <ul className="mb-3 flex flex-col gap-2">
          {settings.emails.map((e) => (
            <li key={e.id} className="flex items-center gap-3 text-sm">
              {e.label}: {e.email}
              <form action={deleteEmail.bind(null, e.id)}>
                <button type="submit" className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addEmail} className="flex gap-2">
          <input name="label" placeholder="Label" className="border p-2" required />
          <input name="email" type="email" placeholder="Email" className="border p-2" required />
          <button type="submit" className="border px-3">Add</button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Social Links</h2>
        <ul className="mb-3 flex flex-col gap-2">
          {settings.socialLinks.map((s) => (
            <li key={s.id} className="flex items-center gap-3 text-sm">
              {s.platform}: {s.url}
              <form action={deleteSocialLink.bind(null, s.id)}>
                <button type="submit" className="text-red-600">Delete</button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addSocialLink} className="flex gap-2">
          <select name="platform" className="border p-2">
            <option value="INSTAGRAM">Instagram</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="PINTEREST">Pinterest</option>
            <option value="TWITTER">Twitter</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
          <input name="url" placeholder="URL" className="border p-2" required />
          <button type="submit" className="border px-3">Add</button>
        </form>
      </section>
    </div>
  );
}
