"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle,
  ChefHat,
  Bike,
  XCircle,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getOrders, updateOrderStatus, buildWhatsAppMessage, WHATSAPP_NUMBERS, type Order } from "@/lib/orders";

const ADMIN_PASSWORD = "darlastaff2026";

const STATUS_CONFIG = {
  new: { label: "New Order", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: ShoppingBag },
  preparing: { label: "Preparing", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300", icon: ChefHat },
  delivering: { label: "Out for Delivery", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", icon: Bike },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", icon: XCircle },
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Card",
  transfer: "Bank Transfer",
  ussd: "USSD",
  pod: "Pay on Delivery",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white dark:bg-brand-plum/30 rounded-2xl p-5 border border-brand-pink/10 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="font-bold text-2xl text-brand-plum dark:text-white">{value}</p>
      <p className="text-brand-charcoal/60 dark:text-white/60 text-sm mt-0.5">{label}</p>
      {sub && <p className="text-xs text-brand-charcoal/40 dark:text-white/40 mt-1">{sub}</p>}
    </div>
  );
}

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;

  const handleStatus = (status: Order["status"]) => {
    setUpdating(true);
    updateOrderStatus(order.id, status);
    setTimeout(() => {
      onStatusChange();
      setUpdating(false);
    }, 300);
  };

  const handleWhatsApp = (number: string) => {
    const msg = buildWhatsAppMessage(order);
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-brand-plum/30 rounded-2xl border border-brand-pink/10 shadow-sm overflow-hidden"
    >
      {/* Header row */}
      <div className="p-5 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="font-bold font-mono text-brand-plum dark:text-white">{order.id}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
              <StatusIcon size={12} />
              {cfg.label}
            </span>
          </div>
          <p className="text-brand-charcoal/50 dark:text-white/50 text-xs">{formatDate(order.createdAt)}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-bold text-brand-pink text-lg">₦{order.total.toLocaleString()}</p>
          <p className="text-xs text-brand-charcoal/50 dark:text-white/50">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-xl hover:bg-brand-pink/10 text-brand-charcoal/50 dark:text-white/50 transition-colors"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Customer summary (always visible) */}
      <div className="px-5 pb-4 flex flex-wrap gap-4 text-sm border-t border-brand-pink/5">
        <div className="pt-3">
          <p className="text-brand-charcoal/40 dark:text-white/40 text-xs">Customer</p>
          <p className="font-semibold text-brand-charcoal dark:text-white">{order.customer.name}</p>
          <p className="text-brand-charcoal/60 dark:text-white/60">{order.customer.phone}</p>
        </div>
        <div className="pt-3">
          <p className="text-brand-charcoal/40 dark:text-white/40 text-xs">Delivery</p>
          <p className="font-semibold text-brand-charcoal dark:text-white line-clamp-1">{order.delivery.address}</p>
          <p className="text-brand-charcoal/60 dark:text-white/60">{order.delivery.city}</p>
        </div>
        <div className="pt-3 ml-auto">
          <p className="text-brand-charcoal/40 dark:text-white/40 text-xs mb-1.5">Items</p>
          <p className="font-semibold text-brand-charcoal dark:text-white">
            {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-brand-pink/10 pt-4 space-y-4">
              {/* Order items */}
              <div>
                <p className="text-xs font-bold text-brand-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-2">
                  Order Items
                </p>
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-brand-charcoal dark:text-white">{item.name} × {item.quantity}</span>
                      <span className="font-semibold text-brand-plum dark:text-white">₦{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 border-t border-brand-pink/10">
                    <span className="text-brand-charcoal/60 dark:text-white/60">Delivery fee</span>
                    <span>{order.deliveryFee === 0 ? "Free" : `₦${order.deliveryFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-brand-plum dark:text-white">Total</span>
                    <span className="text-brand-pink">₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery notes */}
              {(order.delivery.landmark || order.delivery.notes) && (
                <div>
                  <p className="text-xs font-bold text-brand-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-1">Notes</p>
                  {order.delivery.landmark && <p className="text-sm text-brand-charcoal/70 dark:text-white/70">Landmark: {order.delivery.landmark}</p>}
                  {order.delivery.notes && <p className="text-sm text-brand-charcoal/70 dark:text-white/70">{order.delivery.notes}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {/* WhatsApp buttons */}
                <button
                  onClick={() => handleWhatsApp(WHATSAPP_NUMBERS[0])}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                >
                  <MessageCircle size={13} /> WA Line 1
                </button>
                <button
                  onClick={() => handleWhatsApp(WHATSAPP_NUMBERS[1])}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                >
                  <MessageCircle size={13} /> WA Line 2
                </button>

                {/* Status updates */}
                {order.status !== "preparing" && order.status !== "delivered" && order.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatus("preparing")}
                    disabled={updating}
                    className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <ChefHat size={13} /> Mark Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => handleStatus("delivering")}
                    disabled={updating}
                    className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Bike size={13} /> Mark Out for Delivery
                  </button>
                )}
                {order.status === "delivering" && (
                  <button
                    onClick={() => handleStatus("delivered")}
                    disabled={updating}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={13} /> Mark Delivered
                  </button>
                )}
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatus("cancelled")}
                    disabled={updating}
                    className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <XCircle size={13} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | Order["status"]>("all");

  const loadOrders = useCallback(() => {
    setOrders(getOrders());
  }, []);

  useEffect(() => {
    if (authed) loadOrders();
  }, [authed, loadOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-cream dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-brand-plum/40 rounded-3xl p-8 shadow-2xl border border-brand-pink/20 w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-brand-plum dark:text-white">Staff Login</h1>
            <p className="text-brand-charcoal/50 dark:text-white/50 text-sm mt-1">Darla&apos;s Foods Admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand-plum dark:text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff password"
                className="w-full px-4 py-3 rounded-2xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-brand-cream dark:bg-white/10 text-brand-charcoal dark:text-white"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Lock size={16} /> Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const newOrders = orders.filter((o) => o.status === "new");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-plum dark:text-white">
            Orders Dashboard
          </h1>
          <p className="text-brand-charcoal/50 dark:text-white/50 text-sm mt-1">Darla&apos;s Foods Staff Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={() => setAuthed(false)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-500 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(orders.length)} color="bg-brand-pink/10 text-brand-pink" />
        <StatCard icon={Clock} label="New Orders" value={String(newOrders.length)} sub="Needs attention" color="bg-blue-100 text-blue-600" />
        <StatCard icon={Users} label="Today's Orders" value={String(todayOrders.length)} color="bg-purple-100 text-purple-600" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}k`} color="bg-green-100 text-green-600" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {(["all", "new", "preparing", "delivering", "delivered", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              filterStatus === s
                ? "bg-brand-pink text-white shadow-md"
                : "bg-white dark:bg-brand-plum/30 text-brand-charcoal dark:text-white border border-brand-pink/20 hover:border-brand-pink"
            }`}
          >
            {s === "all" ? `All (${orders.length})` : `${STATUS_CONFIG[s].label} (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Eye size={48} className="text-brand-pink/30 mx-auto mb-4" />
          <p className="font-bold text-brand-plum dark:text-white text-lg mb-2">
            {orders.length === 0 ? "No orders yet" : "No orders in this category"}
          </p>
          <p className="text-brand-charcoal/50 dark:text-white/50 text-sm">
            {orders.length === 0
              ? "Orders from customers will appear here once they check out."
              : "Try selecting a different filter above."}
          </p>
          {orders.length === 0 && (
            <div className="mt-6 p-4 bg-brand-pink/5 rounded-2xl border border-brand-pink/20 max-w-sm mx-auto text-left">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-brand-pink" />
                <p className="font-semibold text-brand-plum dark:text-white text-sm">How orders arrive here</p>
              </div>
              <p className="text-brand-charcoal/60 dark:text-white/60 text-xs leading-relaxed">
                When a customer completes checkout on your website, their order is saved and appears on this page automatically. You can then update the order status and contact them via WhatsApp.
              </p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div layout className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={loadOrders} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
