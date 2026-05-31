"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Clock, ChefHat, Bike, Home, MapPin, Package, MessageCircle, XCircle, RefreshCw } from "lucide-react";
import { buildWhatsAppMessage, WHATSAPP_NUMBERS, getOrderById, type Order } from "@/lib/orders";

interface Step {
  id: number;
  icon: React.ElementType;
  label: string;
  desc: string;
}

const steps: Step[] = [
  { id: 1, icon: Package,  label: "Order Received",    desc: "We've received your order and it's being confirmed by Darla's Foods." },
  { id: 2, icon: ChefHat,  label: "Preparing",         desc: "Our chefs are crafting your meal fresh with premium ingredients." },
  { id: 3, icon: Bike,     label: "Out for Delivery",  desc: "Your order is on its way to your delivery address!" },
  { id: 4, icon: Home,     label: "Delivered",         desc: "Enjoy your meal! Please don't forget to leave a review." },
];

const STATUS_TO_STEP: Record<string, number> = {
  new: 1,
  preparing: 2,
  delivering: 3,
  delivered: 4,
  cancelled: 0,
};

export default function TrackingPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [waSent, setWaSent] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadOrder = () => {
    try {
      const raw = sessionStorage.getItem("darlas-last-order");
      if (!raw) return;
      const base = JSON.parse(raw) as Order;
      // Always read fresh status from localStorage
      const live = getOrderById(base.id);
      const resolved = live ?? base;
      setOrder(resolved);
      setCurrentStep(STATUS_TO_STEP[resolved.status] ?? 1);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadOrder();
    // Poll every 15 seconds for admin status updates
    intervalRef.current = setInterval(loadOrder, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleWhatsApp = (number: string) => {
    if (!order) return;
    const msg = buildWhatsAppMessage(order);
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
    setWaSent(true);
  };

  const isCancelled = order?.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className={`inline-flex w-20 h-20 rounded-full items-center justify-center mb-5 ${isCancelled ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
          {isCancelled
            ? <XCircle size={42} className="text-red-500" />
            : <CheckCircle size={42} className="text-green-500" />}
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-plum dark:text-white mb-3">
          {isCancelled ? "Order Cancelled" : "Order Confirmed!"}
        </h1>
        <p className="text-brand-charcoal/60 dark:text-white/60 text-lg">
          {isCancelled
            ? "This order has been cancelled. Please contact us on WhatsApp if you have questions."
            : "Thank you for ordering from Darla's Foods. This page updates automatically."}
        </p>
        <button
          onClick={loadOrder}
          className="mt-3 inline-flex items-center gap-1.5 text-brand-pink text-sm font-medium hover:text-brand-plum transition-colors"
        >
          <RefreshCw size={14} /> Refresh status
        </button>
      </motion.div>

      {/* WhatsApp Banner */}
      {order && !isCancelled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-3xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shrink-0">
              <MessageCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-800 dark:text-green-300 mb-1">
                {waSent ? "✅ Order Sent to WhatsApp!" : "Send Your Order via WhatsApp"}
              </h3>
              <p className="text-green-700 dark:text-green-400 text-sm mb-4">
                {waSent
                  ? "We'll confirm your order and delivery fee shortly via WhatsApp."
                  : "Tap a button to send your order details to Darla's Foods on WhatsApp for quick confirmation."}
              </p>
              {!waSent && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleWhatsApp(WHATSAPP_NUMBERS[0])}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <MessageCircle size={16} /> WhatsApp Line 1
                  </button>
                  <button
                    onClick={() => handleWhatsApp(WHATSAPP_NUMBERS[1])}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <MessageCircle size={16} /> WhatsApp Line 2
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Order Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 dark:bg-brand-plum/40 backdrop-blur-md rounded-3xl p-6 border border-brand-pink/20 shadow-lg mb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider mb-1">Order ID</p>
            <p className="font-bold text-brand-plum dark:text-white text-lg font-mono">{order?.id ?? "—"}</p>
          </div>
          <div>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider mb-1">Delivery Address</p>
            <p className="font-semibold text-brand-charcoal dark:text-white text-sm flex items-center justify-center gap-1">
              <MapPin size={14} className="text-brand-pink" />
              {order ? `${order.delivery.address}, ${order.delivery.city}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider mb-1">
              {order?.deliveryFee && order.deliveryFee > 0 ? "Delivery Fee" : "Status"}
            </p>
            {order?.deliveryFee && order.deliveryFee > 0 ? (
              <p className="font-bold text-brand-pink text-lg">₦{order.deliveryFee.toLocaleString()}</p>
            ) : (
              <p className="font-semibold text-brand-peach text-sm flex items-center justify-center gap-1">
                <Clock size={14} /> Pending confirmation
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status Stepper — only shown if not cancelled */}
      {!isCancelled && (
        <div className="relative">
          <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-brand-pink/15 dark:bg-white/10" />
          <motion.div
            className="absolute left-8 top-12 w-0.5 bg-brand-pink origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: Math.max(0, (currentStep - 1) / (steps.length - 1)) }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ height: "calc(100% - 6rem)" }}
          />

          <div className="space-y-8 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 items-start"
                >
                  <div className="relative shrink-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500 ${
                      isCompleted ? "bg-green-500 text-white"
                      : isActive ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/30"
                      : "bg-white dark:bg-brand-plum/40 text-brand-charcoal/30 dark:text-white/30 border-2 border-brand-pink/10"
                    }`}>
                      {isCompleted ? <CheckCircle size={28} /> : <Icon size={26} />}
                    </div>
                  </div>

                  <div className={`flex-1 bg-white dark:bg-brand-plum/30 rounded-2xl p-5 border transition-all duration-500 ${
                    isActive ? "border-brand-pink shadow-md"
                    : isCompleted ? "border-green-200 dark:border-green-900/50 opacity-80"
                    : "border-brand-pink/10 opacity-40"
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-bold text-base ${isActive ? "text-brand-pink" : isCompleted ? "text-green-600 dark:text-green-400" : "text-brand-charcoal/40 dark:text-white/40"}`}>
                        {step.label}
                      </h3>
                      {isActive && (
                        <span className="text-xs text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2">
                          Current
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full font-semibold shrink-0 ml-2">
                          Done
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${isActive || isCompleted ? "text-brand-charcoal/70 dark:text-white/70" : "text-brand-charcoal/30 dark:text-white/30"}`}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
      >
        <Link href="/menu" className="btn-primary text-center">Order Again</Link>
        <Link href="/" className="btn-secondary text-center">Back to Home</Link>
      </motion.div>
    </div>
  );
}
