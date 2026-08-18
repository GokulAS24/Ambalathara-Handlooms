import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment before seeding.");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { name: "Site Admin", email: ADMIN_EMAIL, passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "Ambalathara Handlooms",
      tagline: "Woven Traditions",
      logoUrl: "/images/logo-full.png",
      logoMarkUrl: "/images/logo-mark.png",
      footerText:
        "Preserving the art of handloom weaving, one thread at a time — crafted by artisans in Ambalathara, Kerala.",
      address: "Ambalathara, Kerala, India",
      whatsappNumber: "919876543210",
      phoneNumbers: { create: [{ label: "Primary", number: "+91 98765 43210", order: 0 }] },
      emails: { create: [{ label: "General", email: "hello@ambalatharahandlooms.in", order: 0 }] },
      socialLinks: {
        create: [
          { platform: "INSTAGRAM", url: "https://instagram.com/ambalatharahandlooms", order: 0 },
          { platform: "WHATSAPP", url: "https://wa.me/919876543210", order: 1 },
        ],
      },
    },
  });

  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      slug: "about",
      title: "About Us",
      sections: {
        create: [
          {
            type: "hero",
            heading: "Our Story",
            body: "Handwoven since generations, crafted by artisans in Ambalathara, Kerala. Every piece carries the story of the weaver who made it.",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.page.upsert({
    where: { slug: "contact" },
    update: {},
    create: {
      slug: "contact",
      title: "Contact Us",
      sections: {
        create: [
          {
            type: "text",
            heading: "We'd love to hear from you",
            body: "Reach out for orders, custom requests, or anything else — our team responds fastest on WhatsApp.",
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.page.upsert({
    where: { slug: "support" },
    update: {},
    create: {
      slug: "support",
      title: "Customer Support",
      sections: {
        create: [
          { type: "faq", heading: "How long does delivery take?", body: "Most orders are delivered within 7–10 days of confirmation, depending on your location.", order: 0 },
          { type: "faq", heading: "Can I customize a saree or fabric order?", body: "Yes — message us on WhatsApp with your requirements and we'll let you know what's possible.", order: 1 },
          { type: "faq", heading: "How do I track my order?", body: "We'll share tracking details over WhatsApp as soon as your order is dispatched.", order: 2 },
        ],
      },
    },
  });

  await prisma.page.upsert({
    where: { slug: "returns" },
    update: {},
    create: {
      slug: "returns",
      title: "10-Day Return Policy",
      sections: {
        create: [
          { type: "note", body: "Items marked Final Sale or custom-tailored pieces are not eligible for return.", order: 0 },
          { type: "note", body: "Returns requested after 10 days from delivery cannot be accepted.", order: 1 },
        ],
      },
    },
  });

  const sarees = await prisma.category.upsert({
    where: { slug: "sarees" },
    update: {},
    create: { name: "Sarees", slug: "sarees", description: "Handwoven sarees", order: 0 },
  });
  const stoles = await prisma.category.upsert({
    where: { slug: "stoles" },
    update: {},
    create: { name: "Stoles", slug: "stoles", description: "Handloom stoles", order: 1 },
  });
  const dupattas = await prisma.category.upsert({
    where: { slug: "dupattas" },
    update: {},
    create: { name: "Dupattas", slug: "dupattas", description: "Handwoven dupattas", order: 2 },
  });
  const fabric = await prisma.category.upsert({
    where: { slug: "fabric" },
    update: {},
    create: { name: "Fabric", slug: "fabric", description: "Handloom fabric by the metre", order: 3 },
  });

  const products = [
    {
      slug: "ivory-handspun-cotton-saree",
      name: "Ivory Handspun Cotton Saree",
      description:
        "A traditional ivory saree woven on a pit loom, featuring a hand-dyed madder border. Lightweight and breathable, finished with a hand-tied tassel edge.",
      price: 3200,
      stock: 12,
      weaveType: "Handspun Cotton",
      categoryId: sarees.id,
      isFeatured: true,
      details: {
        pattern: "Self Design with Woven Border",
        fabric: "Pure Cotton",
        type: "Mundum Neriyathum",
        blousePiece: "Unstitched",
        sariStyle: "Half & Half Saree",
        washCare: "Dry Clean Only",
      },
      reviews: [
        { author: "Anjali Menon", rating: 5, comment: "The border work is stunning in person. Drapes beautifully and the cotton feels authentic." },
        { author: "Priya Nair", rating: 4, comment: "Lovely saree, true to the photos. Wish the packaging had a bit more padding." },
      ],
    },
    {
      slug: "indigo-dyed-cotton-stole",
      name: "Indigo Dyed Cotton Stole",
      description:
        "Naturally indigo-dyed stole, hand-woven with a soft open weave for everyday wear. Each piece has slight variations, a mark of genuine natural dye.",
      price: 1450,
      stock: 25,
      weaveType: "Handloom Cotton",
      categoryId: stoles.id,
      isFeatured: true,
      details: {
        pattern: "Solid",
        fabric: "Pure Cotton",
        type: "Stole",
        blousePiece: "Not Applicable",
        sariStyle: "Not Applicable",
        washCare: "Hand Wash Cold",
      },
      reviews: [
        { author: "Devika Suresh", rating: 5, comment: "Perfect weight for Kerala weather. The indigo shade is deep and doesn't feel synthetic at all." },
        { author: "Ritu Kapoor", rating: 4, comment: "Good quality, colour bled slightly on first wash despite following care instructions." },
      ],
    },
    {
      slug: "turmeric-yellow-silk-dupatta",
      name: "Turmeric Yellow Silk Dupatta",
      description:
        "A radiant turmeric-toned dupatta dyed using traditional natural methods, with a fine silk-cotton blend that catches the light beautifully.",
      price: 2100,
      stock: 18,
      weaveType: "Silk Cotton",
      categoryId: dupattas.id,
      isFeatured: true,
      details: {
        pattern: "Solid with Zari Border",
        fabric: "Silk Cotton Blend",
        type: "Dupatta",
        blousePiece: "Not Applicable",
        sariStyle: "Not Applicable",
        washCare: "Dry Clean Only",
      },
      reviews: [
        { author: "Meera Iyer", rating: 5, comment: "The colour is even more vivid than the photos. Got so many compliments wearing this to a wedding." },
        { author: "Sneha Pillai", rating: 5, comment: "Beautiful sheen and texture. Worth every rupee for the craftsmanship." },
      ],
    },
    {
      slug: "terracotta-handloom-fabric",
      name: "Terracotta Handloom Fabric",
      description:
        "Yardage of earthy terracotta handloom fabric, perfect for tailored garments. Sold by the metre with a consistent, tight weave.",
      price: 890,
      stock: 60,
      weaveType: "Handwoven Cotton",
      categoryId: fabric.id,
      isFeatured: true,
      details: {
        pattern: "Solid",
        fabric: "Handwoven Cotton",
        type: "Yardage / Fabric",
        blousePiece: "Sold by the Metre",
        sariStyle: "Not Applicable",
        washCare: "Machine Wash Cold",
      },
      reviews: [
        { author: "Kavya Krishnan", rating: 4, comment: "Tailored a set of kurtas from this — the fabric holds its shape well after stitching." },
        { author: "Arun Das", rating: 5, comment: "Exactly the colour and weight I needed. Will order more for a second outfit." },
      ],
    },
    {
      slug: "madder-red-silk-saree",
      name: "Madder Red Silk Saree",
      description:
        "A rich madder-dyed silk saree with a temple-inspired hand-woven border, woven over several weeks by our senior artisans.",
      price: 4600,
      stock: 6,
      weaveType: "Handloom Silk",
      categoryId: sarees.id,
      isFeatured: true,
      details: {
        pattern: "Woven Temple Border",
        fabric: "Pure Silk",
        type: "Handloom Silk Saree",
        blousePiece: "Unstitched",
        sariStyle: "Traditional Drape",
        washCare: "Dry Clean Only",
      },
      reviews: [
        { author: "Lakshmi Warrier", rating: 5, comment: "An heirloom piece. The zari border and madder red are exactly what I hoped for." },
        { author: "Nandini Rao", rating: 5, comment: "Bought this for my daughter's engagement. The finish is impeccable." },
      ],
    },
    {
      slug: "sand-beige-cotton-fabric",
      name: "Sand Beige Cotton Fabric",
      description:
        "Soft, breathable handloom cotton in a warm sand tone, woven for daily comfort. A versatile neutral for everyday tailoring.",
      price: 760,
      stock: 45,
      weaveType: "Handwoven Cotton",
      categoryId: fabric.id,
      isFeatured: false,
      details: {
        pattern: "Solid",
        fabric: "Handwoven Cotton",
        type: "Yardage / Fabric",
        blousePiece: "Sold by the Metre",
        sariStyle: "Not Applicable",
        washCare: "Machine Wash Cold",
      },
      reviews: [
        { author: "Fathima Rasheed", rating: 4, comment: "Nice everyday fabric, soft against the skin and doesn't crease too much." },
        { author: "Geetha Menon", rating: 4, comment: "Good basic cotton, colour is a touch lighter than shown on screen but still lovely." },
      ],
    },
  ];

  for (const p of products) {
    const avgRating = p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        weaveType: p.weaveType,
        categoryId: p.categoryId,
        isFeatured: p.isFeatured,
        avgRating,
        reviewCount: p.reviews.length,
        images: {
          create: [1, 2, 3].map((n) => ({
            url: `/images/products/${p.slug}-${n}.jpg`,
            altText: p.name,
            order: n - 1,
          })),
        },
        specs: {
          create: [
            { label: "Pattern", value: p.details.pattern, order: 0 },
            { label: "Fabric", value: p.details.fabric, order: 1 },
            { label: "Type", value: p.details.type, order: 2 },
            { label: "Blouse Piece", value: p.details.blousePiece, order: 3 },
            { label: "Sari Style", value: p.details.sariStyle, order: 4 },
            { label: "Wash Care", value: p.details.washCare, order: 5 },
          ],
        },
        reviews: {
          create: p.reviews.map((r) => ({ author: r.author, rating: r.rating, comment: r.comment })),
        },
      },
    });
  }

  await prisma.heroBanner.deleteMany();
  await prisma.heroBanner.createMany({
    data: [
      {
        title: "",
        desktopImageUrl: "/uploads/a3bf8391-047b-4b52-a10d-3bb85666db96.png",
        mobileImageUrl: "/uploads/a3bf8391-047b-4b52-a10d-3bb85666db96.png",
        order: 0,
        isActive: true,
      },
      {
        title: "",
        desktopImageUrl: "/uploads/d43fd6b8-a667-4110-9a60-41b17ed43166.png",
        mobileImageUrl: "/uploads/d43fd6b8-a667-4110-9a60-41b17ed43166.png",
        order: 1,
        isActive: true,
      },
      {
        title: "",
        desktopImageUrl: "/uploads/ee3d1845-265a-45f8-9efa-1f36105b5dc1.png",
        mobileImageUrl: "/uploads/ee3d1845-265a-45f8-9efa-1f36105b5dc1.png",
        order: 2,
        isActive: true,
      },
    ],
  });

  await prisma.promoBlock.deleteMany();
  await prisma.promoBlock.createMany({
    data: [
      { title: "Kasavu Gold", subtitle: "Ivory and gold-bordered classics", imageUrl: "/images/hero-weaver.jpg", linkHref: "/shop?category=sarees", order: 0 },
      { title: "Indigo Trail", subtitle: "Naturally dyed indigo weaves", imageUrl: "/images/promos/indigo-trail.jpg", linkHref: "/shop?category=stoles", order: 1 },
      { title: "Madder Weave", subtitle: "Rich reds from natural madder root", imageUrl: "/images/promos/madder-weave.jpg", linkHref: "/shop?category=sarees", order: 2 },
    ],
  });

  console.log(`Seed complete. Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
