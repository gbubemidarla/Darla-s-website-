"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { products, categories } from "@/data/products";
import { getLiveMenu } from "@/lib/menu";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  // Start with default products so the page is never empty on first render
  const [menuItems, setMenuItems] = useState<Product[]>(products);

  useEffect(() => {
    const live = getLiveMenu();
    setMenuItems(live);
  }, []);

  const filtered = useMemo(() => {
    const byCat =
      activeCategory === "All"
        ? menuItems
        : menuItems.filter((p) => p.category === activeCategory);
    if (!searchQuery.trim()) return byCat;
    const q = searchQuery.toLowerCase();
    return byCat.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [activeCategory, searchQuery, menuItems]);

  return (
    <>
      <section className="bg-hero-gradient dark:bg-dark-gradient py-16 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto px-4"
        >
          <p className="text-white/80 uppercase tracking-widest text-sm font-semibold mb-3">Fresh Daily</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">Our Menu</h1>
          <p className="text-white/80 text-lg">
            Browse our full selection of premium Nigerian cuisine. Fresh, authentic, and made to order.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="sticky top-16 md:top-20 z-30 bg-brand-cream/95 dark:bg-gray-950/95 backdrop-blur-md pb-4 -mx-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-xl mx-auto mb-5 mt-4"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search for food, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-brand-plum/40 border border-brand-pink/20 focus:border-brand-pink focus:outline-none text-brand-charcoal dark:text-white placeholder-brand-charcoal/40 dark:placeholder-white/40 shadow-sm transition-all"
            />
          </motion.div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 shrink-0 ${
                  activeCategory === cat
                    ? "bg-brand-pink text-white shadow-md shadow-brand-pink/30"
                    : "bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white border border-brand-pink/20 hover:border-brand-pink hover:text-brand-pink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 mt-2">
          <p className="text-brand-charcoal/60 dark:text-white/60 text-sm">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
            {activeCategory !== "All" && ` in "${activeCategory}"`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-6xl mb-4">🍽️</p>
            <p className="text-brand-plum dark:text-white font-bold text-xl mb-2">No items found</p>
            <p className="text-brand-charcoal/60 dark:text-white/60">Try a different search term or category.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="btn-primary mt-6"
            >
              Show All Items
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}
