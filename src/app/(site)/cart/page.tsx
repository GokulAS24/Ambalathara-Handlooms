"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProductsByIds } from "@/hooks/useProductsByIds";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const WHATSAPP_GREEN = "#25D366";
const CLAY_900 = "#190f0a";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { products, loading } = useProductsByIds(cart.map((c) => c.id));
  const [redirecting, setRedirecting] = useState(false);

  const items = cart
    .map((entry) => {
      const product = products.find((p) => p.id === entry.id);
      return product ? { product, qty: entry.qty } : null;
    })
    .filter((item): item is { product: (typeof products)[number]; qty: number } => item !== null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  async function handleCheckout() {
    if (redirecting || items.length === 0) return;
    setRedirecting(true);

    const settings = await fetch("/api/settings").then((r) => r.json());

    const lines = [
      "Hi! I'd like to purchase the following:",
      "",
      ...items.map(
        (item) => `*${item.product.name}* — Qty: ${item.qty} — Rs. ${(item.product.price * item.qty).toLocaleString("en-IN")}`
      ),
      "",
      `Total: Rs. ${subtotal.toLocaleString("en-IN")}`,
      "",
      "Could you confirm availability?",
    ];

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

    setTimeout(() => window.open(url, "_blank", "noopener,noreferrer"), 650);
    setTimeout(() => setRedirecting(false), 2400);
  }

  if (loading) {
    return <div className="mx-auto max-w-5xl px-6 py-24 text-center text-clay-400">Loading your bag…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-500">Your Cart</p>
        <h1 className="mt-2 font-serif text-3xl text-clay-800 md:text-4xl">Shopping Bag</h1>
      </div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <ShoppingBag size={40} strokeWidth={1.25} className="text-clay-300" />
          <p className="text-clay-500">Your bag is empty.</p>
          <Link href="/shop" className="mt-2 rounded-sm bg-clay-800 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-sand-50 transition-colors hover:bg-clay-900">
            Browse the Collection
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <AnimatePresence initial={false}>
              {items.map(({ product, qty }) => (
                <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="flex gap-4 border-b border-clay-100 py-5">
                  <Link href={`/product/${product.id}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-clay-50">
                    {product.images[0] && (
                      <Image src={product.images[0].url} alt={product.name} fill sizes="80px" className="object-cover" />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/product/${product.id}`} className="text-[15px] font-medium text-clay-800 hover:text-brand-600">
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-xs uppercase tracking-wider text-clay-400">
                          {product.category?.name} · {product.weaveType}
                        </p>
                      </div>
                      <button type="button" aria-label="Remove item" onClick={() => removeFromCart(product.id)} className="text-clay-400 transition-colors hover:text-brand-600">
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex h-9 items-stretch border border-clay-300">
                        <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(product.id, qty - 1)} className="flex w-8 items-center justify-center text-clay-600 hover:bg-clay-50 hover:text-brand-600">
                          <Minus size={12} />
                        </button>
                        <span className="flex w-8 items-center justify-center border-x border-clay-300 text-sm text-clay-800">{qty}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(product.id, qty + 1)} className="flex w-8 items-center justify-center text-clay-600 hover:bg-clay-50 hover:text-brand-600">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-clay-800">₹{(product.price * qty).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="h-fit rounded-sm border border-clay-200 p-6">
            <h2 className="font-serif text-xl text-clay-800">Order Summary</h2>
            <div className="mt-5 flex items-center justify-between text-sm text-clay-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <p className="mt-1 text-xs text-clay-400">Shipping calculated at checkout.</p>
            <div className="mt-5 flex items-center justify-between border-t border-clay-100 pt-4 text-base font-medium text-clay-800">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <motion.button
              type="button"
              onClick={handleCheckout}
              animate={{ backgroundColor: redirecting ? WHATSAPP_GREEN : CLAY_900 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative mt-6 h-13 w-full overflow-hidden text-xs font-semibold uppercase tracking-[0.2em] text-sand-50"
            >
              <AnimatePresence mode="wait" initial={false}>
                {redirecting ? (
                  <motion.span key="redirecting" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }} className="flex h-full items-center justify-center gap-2">
                    <WhatsAppIcon className="h-4 w-4" /> Redirecting to WhatsApp…
                  </motion.span>
                ) : (
                  <motion.span key="checkout" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.2 }} className="flex h-full items-center justify-center">
                    Checkout via WhatsApp
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <Link href="/shop" className="mt-4 block text-center text-xs font-medium uppercase tracking-wider text-clay-500 hover:text-brand-600">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
