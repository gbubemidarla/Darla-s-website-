"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const DELIVERY_FEE = 800;

type PaymentMethod = "card" | "transfer" | "ussd" | "pod";

const paymentOptions: {
  id: PaymentMethod;
  label: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  { id: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard, Verve", icon: CreditCard },
  { id: "transfer", label: "Bank Transfer", desc: "Direct bank-to-bank transfer", icon: Banknote },
  { id: "ussd", label: "USSD", desc: "*737#, *966#, *777# & more", icon: Smartphone },
  { id: "pod", label: "Pay on Delivery", desc: "Pay when your order arrives", icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    landmark: "",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const deliveryFee = state.items.length > 0 ? (subtotal >= 5000 ? 0 : DELIVERY_FEE) : 0;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    router.push("/tracking");
  };

  const field = (
    name: keyof typeof form,
    label: string,
    icon: React.ElementType,
    type = "text",
    placeholder = ""
  ) => {
    const Icon = icon;
    return (
      <div>
        <label className="block text-sm font-semibold text-brand-plum dark:text-white mb-2">
          {label}
        </label>
        <div className="relative">
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/40 dark:text-white/40"
          />
          <input
            type={type}
            value={form[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            placeholder={placeholder}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl border ${
              errors[name]
                ? "border-red-400"
                : "border-brand-pink/20 focus:border-brand-pink"
            } focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white placeholder-brand-charcoal/30 dark:placeholder-white/30 transition-all`}
          />
        </div>
        {errors[name] && (
          <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  if (state.items.length === 0 && !submitting) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h2 className="font-display font-bold text-2xl text-brand-plum dark:text-white mb-4">
          No items to checkout
        </h2>
        <Link href="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-brand-pink font-medium hover:text-brand-plum transition-colors mb-8"
      >
        <ArrowLeft size={18} /> Back to Cart
      </Link>

      <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-plum dark:text-white mb-10">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-brand-plum/30 rounded-3xl p-6 shadow-sm border border-brand-pink/10"
            >
              <h2 className="font-bold text-xl text-brand-plum dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-pink text-white text-sm flex items-center justify-center font-bold">
                  1
                </span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field("name", "Full Name *", User, "text", "e.g. Adaeze Okonkwo")}
                {field("phone", "Phone Number *", Phone, "tel", "+234 801 234 5678")}
                <div className="sm:col-span-2">
                  {field("email", "Email Address *", Mail, "email", "you@example.com")}
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-brand-plum/30 rounded-3xl p-6 shadow-sm border border-brand-pink/10"
            >
              <h2 className="font-bold text-xl text-brand-plum dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-pink text-white text-sm flex items-center justify-center font-bold">
                  2
                </span>
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  {field("address", "Street Address *", MapPin, "text", "12 Allen Avenue, Ikeja")}
                </div>
                {field("city", "City / Area *", MapPin, "text", "Lagos Island")}
                {field("landmark", "Nearest Landmark", MapPin, "text", "Near First Bank ATM")}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-brand-plum dark:text-white mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Special delivery instructions..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white placeholder-brand-charcoal/30 dark:placeholder-white/30 transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-brand-plum/30 rounded-3xl p-6 shadow-sm border border-brand-pink/10"
            >
              <h2 className="font-bold text-xl text-brand-plum dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-pink text-white text-sm flex items-center justify-center font-bold">
                  3
                </span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayment(opt.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        payment === opt.id
                          ? "border-brand-pink bg-brand-pink/5"
                          : "border-brand-pink/15 hover:border-brand-pink/40"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          payment === opt.id
                            ? "bg-brand-pink text-white"
                            : "bg-brand-cream dark:bg-white/10 text-brand-plum dark:text-white"
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${payment === opt.id ? "text-brand-pink" : "text-brand-plum dark:text-white"}`}>
                          {opt.label}
                        </p>
                        <p className="text-brand-charcoal/50 dark:text-white/50 text-xs">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-brand-plum/30 rounded-3xl p-6 shadow-md border border-brand-pink/10 sticky top-24">
              <h2 className="font-bold text-xl text-brand-plum dark:text-white mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 mb-5 max-h-48 overflow-y-auto scrollbar-hide">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-brand-charcoal/70 dark:text-white/70 line-clamp-1 flex-1 mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-brand-plum dark:text-white shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-pink/10 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-charcoal/70 dark:text-white/70">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-charcoal/70 dark:text-white/70">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-500 font-semibold" : "font-semibold"}>
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-brand-pink/10 pt-3">
                  <span className="font-bold text-brand-plum dark:text-white text-base">Total</span>
                  <span className="font-bold text-brand-pink text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                    />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Place Order — {formatPrice(total)}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-brand-charcoal/40 dark:text-white/40 mt-3 flex items-center justify-center gap-1">
                <CheckCircle size={12} className="text-green-400" />
                Secure & encrypted checkout
              </p>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
