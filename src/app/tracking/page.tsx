"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  ChefHat,
  Bike,
  Home,
  MapPin,
  Package,
} from "lucide-react";

interface Step {
  id: number;
  icon: React.ElementType;
  label: string;
  desc: string;
  time: string;
}

const steps: Step[] = [
  {
    id: 1,
    icon: Package,
    label: "Order Received",
    desc: "We've received your order and it's being confirmed.",
    time: "Just now",
  },
  {
    id: 2,
    icon: ChefHat,
    label: "Preparing",
    desc: "Our chefs are crafting your meal with fresh ingredients.",
    time: "5–10 min",
  },
  {
    id: 3,
    icon: Bike,
    label: "Out for Delivery",
    desc: "Your order is on its way! Track your rider in real-time.",
    time: "15–25 min",
  },
  {
    id: 4,
    icon: Home,
    label: "Delivered",
    desc: "Enjoy your meal! Don't forget to leave a review.",
    time: "~40 min",
  },
];

function generateOrderId() {
  return "DRL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function TrackingPage() {
  const [orderId] = useState(generateOrderId);
  const [currentStep, setCurrentStep] = useState(1);
  const [eta, setEta] = useState(40);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setCurrentStep(2), 3000),
      setTimeout(() => setCurrentStep(3), 8000),
      setTimeout(() => setCurrentStep(4), 18000),
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (eta <= 0) return;
    const timer = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60000);
    return () => clearInterval(timer);
  }, [eta]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-5">
          <CheckCircle size={42} className="text-green-500" />
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-plum dark:text-white mb-3">
          Order Confirmed!
        </h1>
        <p className="text-brand-charcoal/60 dark:text-white/60 text-lg">
          Thank you for ordering from Darla&apos;s Foods. Your food is being prepared.
        </p>
      </motion.div>

      {/* Order Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass bg-white/80 dark:bg-brand-plum/40 rounded-3xl p-6 border border-brand-pink/20 shadow-lg mb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider mb-1">
              Order ID
            </p>
            <p className="font-bold text-brand-plum dark:text-white text-lg font-mono">
              {orderId}
            </p>
          </div>
          <div>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider mb-1">
              Delivery Address
            </p>
            <p className="font-semibold text-brand-charcoal dark:text-white text-sm flex items-center justify-center gap-1">
              <MapPin size={14} className="text-brand-pink" />
              Your saved address
            </p>
          </div>
          <div>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider mb-1">
              Estimated Arrival
            </p>
            <p className="font-bold text-brand-pink text-lg flex items-center justify-center gap-1">
              <Clock size={18} />
              {eta > 0 ? `~${eta} min` : "Arriving now!"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Status Stepper */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-brand-pink/15 dark:bg-white/10" />
        <motion.div
          className="absolute left-8 top-12 w-0.5 bg-brand-pink origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            height: `calc(100% - 6rem)`,
          }}
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
                {/* Icon */}
                <div className="relative shrink-0">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.15, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/30"
                        : "bg-white dark:bg-brand-plum/40 text-brand-charcoal/30 dark:text-white/30 border-2 border-brand-pink/10"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={28} />
                    ) : (
                      <Icon size={26} />
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div
                  className={`flex-1 bg-white dark:bg-brand-plum/30 rounded-2xl p-5 border transition-all duration-500 ${
                    isActive
                      ? "border-brand-pink shadow-md"
                      : isCompleted
                      ? "border-green-200 dark:border-green-900/50 opacity-80"
                      : "border-brand-pink/10 opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3
                      className={`font-bold text-base ${
                        isActive
                          ? "text-brand-pink"
                          : isCompleted
                          ? "text-green-600 dark:text-green-400"
                          : "text-brand-charcoal/40 dark:text-white/40"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <span className="text-xs text-brand-charcoal/40 dark:text-white/40 shrink-0 ml-3">
                      {step.time}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      isActive || isCompleted
                        ? "text-brand-charcoal/70 dark:text-white/70"
                        : "text-brand-charcoal/30 dark:text-white/30"
                    }`}
                  >
                    {step.desc}
                  </p>

                  {isActive && step.id !== 4 && (
                    <div className="flex gap-1 mt-3">
                      {[0, 0.2, 0.4].map((delay, j) => (
                        <motion.div
                          key={j}
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay }}
                          className="w-2 h-2 bg-brand-pink rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
      >
        <Link href="/menu" className="btn-primary text-center">
          Order Again
        </Link>
        <Link href="/" className="btn-secondary text-center">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
