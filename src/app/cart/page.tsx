"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { useState } from "react";

const PROMO_CODE = "DARLA20";
const PROMO_DISCOUNT = 0.2;

export default function CartPage() {
  const { state, removeItem, updateQty, subtotal } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try DARLA20!");
      setPromoApplied(false);
    }
  };

  const discount = promoApplied ? subtotal * PROMO_DISCOUNT : 0;
  const total = subtotal - discount;

  if (state.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex w-24 h-24 bg-brand-pink/10 rounded-full items-center justify-center mb-6"
        >
          <ShoppingBag size={42} className="text-brand-pink" />
        </motion.div>
        <h2 className="font-display font-bold text-3xl text-brand-plum dark:text-white mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-brand-charcoal/60 dark:text-white/60 mb-8 text-lg">
          Add some delicious food to get started!
        </p>
        <Link href="/menu" className="btn-primary inline-flex items-center gap-2">
          Browse Menu <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-bold text-3xl md:text-4xl text-brand-plum dark:text-white mb-10"
      >
        Your Cart{" "}
        <span className="text-brand-pink">({state.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {state.items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-brand-plum/30 rounded-3xl p-5 shadow-sm border border-brand-pink/10 flex gap-4 items-start"
              >
                {/* Image */}
                <Link href={`/product/${item.product.id}`} className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className="font-bold text-brand-plum dark:text-white text-base hover:text-brand-pink transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  {Object.entries(item.selectedModifiers).length > 0 && (
                    <p className="text-xs text-brand-charcoal/50 dark:text-white/50 mt-0.5">
                      {Object.entries(item.selectedModifiers)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" • ")}
                    </p>
                  )}
                  <p className="text-brand-pink font-bold mt-2">
                    {formatPrice(item.effectivePrice ?? item.product.price)}
                  </p>
                </div>

                {/* Qty Controls */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-1 bg-brand-cream dark:bg-white/10 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all text-brand-plum dark:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center font-bold text-sm text-brand-charcoal dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all text-brand-plum dark:text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="font-bold text-brand-plum dark:text-white text-sm">
                    {formatPrice((item.effectivePrice ?? item.product.price) * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white dark:bg-brand-plum/30 rounded-3xl p-6 shadow-md border border-brand-pink/10 sticky top-24">
            <h2 className="font-bold text-xl text-brand-plum dark:text-white mb-6">
              Order Summary
            </h2>

            {/* Promo Code */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-charcoal dark:text-white mb-2 flex items-center gap-2">
                <Tag size={14} className="text-brand-pink" /> Promo Code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. DARLA20"
                  className="flex-1 px-3 py-2 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none text-sm bg-brand-cream dark:bg-white/10 text-brand-charcoal dark:text-white"
                />
                <button
                  onClick={applyPromo}
                  className="bg-brand-pink text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-plum transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="text-green-500 text-xs mt-2 font-medium">
                  🎉 DARLA20 applied! 20% off.
                </p>
              )}
              {promoError && (
                <p className="text-red-400 text-xs mt-2">{promoError}</p>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-charcoal/70 dark:text-white/70">Subtotal</span>
                <span className="font-semibold text-brand-charcoal dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-500">
                  <span>Discount (20%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-charcoal/70 dark:text-white/70">Delivery Fee</span>
                <span className="text-brand-peach font-medium text-sm">Assigned by Darla&apos;s</span>
              </div>
              <div className="border-t border-brand-pink/10 pt-3 flex justify-between">
                <span className="font-bold text-brand-plum dark:text-white text-base">Subtotal</span>
                <span className="font-bold text-brand-pink text-xl">{formatPrice(total)}</span>
              </div>
            </div>

            <p className="text-xs text-brand-charcoal/40 dark:text-white/40 mt-3 text-center">
              Delivery fee will be confirmed by Darla&apos;s Foods after you place your order.
            </p>

            <Link
              href="/checkout"
              className="btn-primary w-full text-center mt-6 flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <Link
              href="/menu"
              className="block text-center text-brand-pink text-sm font-medium mt-4 hover:text-brand-plum transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
