"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-brand-plum/40 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-brand-pink/10"
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="relative h-52 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-3 right-3 bg-brand-gold text-brand-charcoal text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-brand-plum dark:text-white text-base mb-1 hover:text-brand-pink transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-brand-charcoal/60 dark:text-white/60 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < Math.floor(product.rating)
                  ? "fill-brand-gold text-brand-gold"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="text-xs text-brand-charcoal/50 dark:text-white/50 ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-brand-plum dark:text-white text-lg">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-brand-charcoal/40 dark:text-white/40 text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Qty + Add to Cart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-brand-cream dark:bg-white/10 rounded-xl px-2 py-1">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors text-brand-plum dark:text-white"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-semibold text-brand-charcoal dark:text-white">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-brand-pink hover:text-white transition-colors text-brand-plum dark:text-white"
            >
              <Plus size={14} />
            </button>
          </div>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.92 }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
              added
                ? "bg-green-500 text-white"
                : "bg-brand-pink text-white hover:bg-brand-plum"
            }`}
          >
            <ShoppingCart size={15} />
            {added ? "Added!" : "Add to Cart"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
