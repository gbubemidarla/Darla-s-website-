"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Star, ArrowLeft, Plus, Minus, ShoppingCart, CheckCircle, ChevronRight } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { getLiveProduct } from "@/lib/menu";
import { useCart } from "@/context/CartContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const p = getLiveProduct(id);
    setProduct(p ?? null);
    setLoaded(true);
  }, [id]);

  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  if (loaded && !product) return notFound();
  if (!product) return null;

  const handleAdd = () => {
    addItem(product, qty, selectedModifiers);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleModifier = (label: string, option: string) => {
    setSelectedModifiers((prev) => ({ ...prev, [label]: option }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-brand-charcoal/50 dark:text-white/50 mb-8">
        <Link href="/" className="hover:text-brand-pink transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/menu" className="hover:text-brand-pink transition-colors">Menu</Link>
        <ChevronRight size={14} />
        <span className="text-brand-charcoal dark:text-white font-medium line-clamp-1">{product.name}</span>
      </nav>

      <Link href="/menu" className="inline-flex items-center gap-2 text-brand-pink font-medium hover:text-brand-plum transition-colors mb-8">
        <ArrowLeft size={18} /> Back to Menu
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image src={product.image} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
            {product.badge && (
              <span className="absolute top-5 left-5 bg-brand-pink text-white font-bold px-4 py-2 rounded-full text-sm">{product.badge}</span>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
          <span className="text-brand-pink text-sm font-semibold uppercase tracking-widest mb-3">{product.category}</span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-plum dark:text-white mb-4">{product.name}</h1>

          <div className="flex items-center gap-2 mb-5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-brand-gold text-brand-gold" : "text-gray-300"} />
              ))}
            </div>
            <span className="font-semibold text-brand-charcoal dark:text-white">{product.rating}</span>
            <span className="text-brand-charcoal/50 dark:text-white/50 text-sm">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-bold text-4xl text-brand-plum dark:text-white">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-brand-charcoal/40 dark:text-white/40 text-xl line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <p className="text-brand-charcoal/70 dark:text-white/70 leading-relaxed mb-8 text-base">{product.longDescription}</p>

          <div className="mb-8">
            <h3 className="font-bold text-brand-plum dark:text-white mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <span key={ing} className="bg-brand-pink/10 dark:bg-brand-pink/20 text-brand-pink text-xs font-medium px-3 py-1.5 rounded-full">{ing}</span>
              ))}
            </div>
          </div>

          {product.modifiers && product.modifiers.length > 0 && (
            <div className="mb-8 space-y-5">
              {product.modifiers.map((mod) => (
                <div key={mod.label}>
                  <h3 className="font-bold text-brand-plum dark:text-white mb-3">{mod.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {mod.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleModifier(mod.label, opt)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                          selectedModifiers[mod.label] === opt
                            ? "bg-brand-pink text-white border-brand-pink"
                            : "bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white border-brand-pink/20 hover:border-brand-pink"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center gap-2 bg-brand-cream dark:bg-white/10 rounded-2xl px-4 py-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all text-brand-plum dark:text-white">
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-bold text-brand-plum dark:text-white text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-brand-pink hover:text-white transition-all text-brand-plum dark:text-white">
                <Plus size={16} />
              </button>
            </div>

            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                added ? "bg-green-500 text-white" : "bg-brand-pink text-white hover:bg-brand-plum shadow-lg shadow-brand-pink/30"
              }`}
            >
              {added ? <><CheckCircle size={20} /> Added to Cart!</> : <><ShoppingCart size={20} /> Add to Cart — {formatPrice(product.price * qty)}</>}
            </motion.button>
          </div>

          {added && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center justify-center">
              <Link href="/cart" className="text-brand-pink font-semibold text-sm hover:underline">View Cart & Checkout →</Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
