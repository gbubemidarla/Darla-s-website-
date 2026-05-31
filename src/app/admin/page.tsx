"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, LogOut, ShoppingBag, CheckCircle, ChefHat, Bike, XCircle,
  MessageCircle, RefreshCw, Users, DollarSign, Eye,
  ChevronDown, ChevronUp, Pencil, Trash2, Plus, Save,
  RotateCcw, UtensilsCrossed, X, Star, ThumbsUp, ThumbsDown,
} from "lucide-react";
import {
  getOrders, updateOrderStatus, updateOrderDeliveryFee,
  buildWhatsAppMessage, WHATSAPP_NUMBERS, type Order,
} from "@/lib/orders";
import { getLiveMenu, saveLiveMenu, resetMenu } from "@/lib/menu";
import {
  getReviews, approveReview, rejectReview, deleteReview, type Review,
} from "@/lib/reviews";
import { categories, type Product } from "@/data/products";

const ADMIN_PASSWORD = "darlastaff2026";

const STATUS_CONFIG = {
  new:       { label: "New Order",        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",      icon: ShoppingBag },
  preparing: { label: "Preparing",        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300", icon: ChefHat },
  delivering:{ label: "Out for Delivery", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", icon: Bike },
  delivered: { label: "Delivered",        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",   icon: CheckCircle },
  cancelled: { label: "Cancelled",        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",           icon: XCircle },
};

const PAYMENT_LABELS: Record<string, string> = {
  card: "Card", transfer: "Bank Transfer", ussd: "USSD", pod: "Pay on Delivery",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-brand-plum/30 rounded-2xl p-5 border border-brand-pink/10 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="font-bold text-2xl text-brand-plum dark:text-white">{value}</p>
      <p className="text-brand-charcoal/60 dark:text-white/60 text-sm mt-0.5">{label}</p>
    </div>
  );
}

// ─── Order Card ──────────────────────────────────────────────────────────────
function OrderCard({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [feeInput, setFeeInput] = useState(String(order.deliveryFee || ""));
  const [feeUpdating, setFeeUpdating] = useState(false);
  const [feeSaved, setFeeSaved] = useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const StatusIcon = cfg.icon;

  const handleStatus = (status: Order["status"]) => {
    updateOrderStatus(order.id, status);
    setTimeout(onRefresh, 200);
  };

  const handleFee = () => {
    const fee = parseFloat(feeInput);
    if (isNaN(fee) || fee < 0) return;
    setFeeUpdating(true);
    updateOrderDeliveryFee(order.id, fee);
    setTimeout(() => {
      setFeeUpdating(false);
      setFeeSaved(true);
      onRefresh();
      setTimeout(() => setFeeSaved(false), 2000);
    }, 300);
  };

  const handleWhatsApp = (number: string) => {
    const msg = buildWhatsAppMessage(order);
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-brand-plum/30 rounded-2xl border border-brand-pink/10 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-5 flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <span className="font-bold font-mono text-brand-plum dark:text-white">{order.id}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
              <StatusIcon size={12} />{cfg.label}
            </span>
          </div>
          <p className="text-brand-charcoal/50 dark:text-white/50 text-xs">{formatDate(order.createdAt)}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-brand-pink text-lg">₦{order.total.toLocaleString()}</p>
          <p className="text-xs text-brand-charcoal/50 dark:text-white/50">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-xl hover:bg-brand-pink/10 text-brand-charcoal/50 dark:text-white/50 transition-colors">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Customer summary */}
      <div className="px-5 pb-4 flex flex-wrap gap-6 text-sm border-t border-brand-pink/5">
        <div className="pt-3">
          <p className="text-brand-charcoal/40 dark:text-white/40 text-xs">Customer</p>
          <p className="font-semibold text-brand-charcoal dark:text-white">{order.customer.name}</p>
          <p className="text-brand-charcoal/60 dark:text-white/60">{order.customer.phone}</p>
        </div>
        <div className="pt-3">
          <p className="text-brand-charcoal/40 dark:text-white/40 text-xs">Delivery</p>
          <p className="font-semibold text-brand-charcoal dark:text-white">{order.delivery.address}</p>
          <p className="text-brand-charcoal/60 dark:text-white/60">{order.delivery.city}</p>
        </div>
        <div className="pt-3">
          <p className="text-brand-charcoal/40 dark:text-white/40 text-xs">Items</p>
          <p className="font-semibold text-brand-charcoal dark:text-white">
            {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
          </p>
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-6 border-t border-brand-pink/10 pt-5 space-y-5">

              {/* Order items */}
              <div>
                <p className="text-xs font-bold text-brand-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-2">Order Items</p>
                <div className="space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-brand-charcoal dark:text-white">{item.name} × {item.quantity}</span>
                      <span className="font-semibold text-brand-plum dark:text-white">₦{item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Fee Assignment */}
              <div className="bg-brand-cream dark:bg-white/5 rounded-2xl p-4">
                <p className="text-xs font-bold text-brand-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-3">
                  Assign Delivery Fee
                </p>
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-brand-charcoal dark:text-white font-semibold">₦</span>
                    <input
                      type="number"
                      min="0"
                      value={feeInput}
                      onChange={(e) => setFeeInput(e.target.value)}
                      placeholder="e.g. 500"
                      className="flex-1 px-3 py-2 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm"
                    />
                  </div>
                  <button
                    onClick={handleFee}
                    disabled={feeUpdating}
                    className={`flex items-center gap-1.5 font-semibold px-4 py-2 rounded-xl text-sm transition-colors ${
                      feeSaved ? "bg-green-500 text-white" : "bg-brand-pink hover:bg-brand-plum text-white"
                    } disabled:opacity-50`}
                  >
                    <Save size={13} />
                    {feeSaved ? "Saved!" : "Set Fee"}
                  </button>
                </div>
                {order.deliveryFee > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Current fee: ₦{order.deliveryFee.toLocaleString()} — Order total: ₦{order.total.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Notes */}
              {(order.delivery.landmark || order.delivery.notes) && (
                <div>
                  <p className="text-xs font-bold text-brand-charcoal/40 dark:text-white/40 uppercase tracking-wider mb-1">Notes</p>
                  {order.delivery.landmark && <p className="text-sm text-brand-charcoal/70 dark:text-white/70">Landmark: {order.delivery.landmark}</p>}
                  {order.delivery.notes && <p className="text-sm text-brand-charcoal/70 dark:text-white/70">{order.delivery.notes}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={() => handleWhatsApp(WHATSAPP_NUMBERS[0])}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                  <MessageCircle size={13} /> WA Line 1
                </button>
                <button onClick={() => handleWhatsApp(WHATSAPP_NUMBERS[1])}
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                  <MessageCircle size={13} /> WA Line 2
                </button>
                {order.status === "new" && (
                  <button onClick={() => handleStatus("preparing")}
                    className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                    <ChefHat size={13} /> Mark Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button onClick={() => handleStatus("delivering")}
                    className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                    <Bike size={13} /> Out for Delivery
                  </button>
                )}
                {order.status === "delivering" && (
                  <button onClick={() => handleStatus("delivered")}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                    <CheckCircle size={13} /> Mark Delivered
                  </button>
                )}
                {order.status !== "delivered" && order.status !== "cancelled" && (
                  <button onClick={() => handleStatus("cancelled")}
                    className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                    <XCircle size={13} /> Cancel Order
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

// ─── Menu Item Form ───────────────────────────────────────────────────────────
const BLANK_ITEM: Partial<Product> = {
  name: "", category: "Meatpie & Pastries", price: 0,
  description: "", badge: "", image: "",
};

function MenuItemForm({
  initial, onSave, onCancel,
}: {
  initial: Partial<Product>;
  onSave: (item: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);

  const set = (key: keyof Product, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-cream dark:bg-white/5 rounded-2xl p-5 border border-brand-pink/20 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-brand-charcoal/50 dark:text-white/50 uppercase mb-1">Item Name *</label>
          <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Pepper Soup"
            className="w-full px-4 py-2.5 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-charcoal/50 dark:text-white/50 uppercase mb-1">Category *</label>
          <select value={form.category ?? ""} onChange={(e) => set("category", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm">
            {categories.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-charcoal/50 dark:text-white/50 uppercase mb-1">Price (₦) *</label>
          <input type="number" min="0" value={form.price ?? ""} onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            placeholder="e.g. 1500"
            className="w-full px-4 py-2.5 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-brand-charcoal/50 dark:text-white/50 uppercase mb-1">Short Description *</label>
          <input value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. Spicy goat pepper soup with herbs"
            className="w-full px-4 py-2.5 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-charcoal/50 dark:text-white/50 uppercase mb-1">Badge (optional)</label>
          <input value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value)}
            placeholder="e.g. New, Hot, Popular"
            className="w-full px-4 py-2.5 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-charcoal/50 dark:text-white/50 uppercase mb-1">Image URL (optional)</label>
          <input value={form.image ?? ""} onChange={(e) => set("image", e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-white dark:bg-brand-plum/40 text-brand-charcoal dark:text-white text-sm" />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={!form.name || !form.price}
          className="flex items-center gap-1.5 bg-brand-pink hover:bg-brand-plum text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-40"
        >
          <Save size={14} /> Save Item
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1.5 bg-white dark:bg-white/10 text-brand-charcoal dark:text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-brand-pink/20 hover:border-brand-pink transition-colors">
          <X size={14} /> Cancel
        </button>
      </div>
    </motion.div>
  );
}

// ─── Menu Tab ────────────────────────────────────────────────────────────────
function MenuTab() {
  const [items, setItems] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = useCallback(() => setItems(getLiveMenu()), []);
  useEffect(() => { load(); }, [load]);

  const save = (updated: Product[]) => {
    saveLiveMenu(updated);
    setItems(updated);
  };

  const handleEdit = (id: string, changes: Partial<Product>) => {
    const updated = items.map((it) => (it.id === id ? { ...it, ...changes } : it));
    save(updated);
    setEditingId(null);
  };

  const handleAdd = (data: Partial<Product>) => {
    const newItem: Product = {
      id: "custom-" + Date.now(),
      name: data.name ?? "New Item",
      category: data.category ?? "Rice",
      price: data.price ?? 0,
      description: data.description ?? "",
      longDescription: data.description ?? "",
      ingredients: [],
      image: data.image || "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      badge: data.badge || undefined,
      rating: 4.5,
      reviews: 0,
    };
    save([newItem, ...items]);
    setAddingNew(false);
  };

  const handleDelete = (id: string) => {
    save(items.filter((it) => it.id !== id));
    setDeleteConfirm(null);
  };

  const handleReset = () => {
    if (!confirm("This will restore the original default menu. Any custom items will be lost. Continue?")) return;
    resetMenu();
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-brand-charcoal/60 dark:text-white/60 text-sm">
          {items.length} item{items.length !== 1 ? "s" : ""} on your menu
        </p>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="flex items-center gap-1.5 bg-white dark:bg-white/10 border border-brand-pink/20 hover:border-brand-pink text-brand-charcoal dark:text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <RotateCcw size={14} /> Reset to Default
          </button>
          <button onClick={() => { setAddingNew(true); setEditingId(null); }}
            className="flex items-center gap-1.5 bg-brand-pink hover:bg-brand-plum text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            <Plus size={14} /> Add New Item
          </button>
        </div>
      </div>

      {addingNew && (
        <div className="mb-6">
          <p className="font-bold text-brand-plum dark:text-white mb-3">New Menu Item</p>
          <MenuItemForm initial={BLANK_ITEM} onSave={handleAdd} onCancel={() => setAddingNew(false)} />
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <motion.div key={item.id} layout
            className="bg-white dark:bg-brand-plum/30 rounded-2xl border border-brand-pink/10 overflow-hidden">

            {editingId === item.id ? (
              <div className="p-5">
                <p className="font-bold text-brand-plum dark:text-white mb-3">Editing: {item.name}</p>
                <MenuItemForm
                  initial={{ name: item.name, category: item.category, price: item.price, description: item.description, badge: item.badge, image: item.image }}
                  onSave={(changes) => handleEdit(item.id, changes)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-brand-pink/10">
                  {item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-brand-plum dark:text-white text-sm">{item.name}</p>
                    {item.badge && (
                      <span className="text-xs bg-brand-pink/10 text-brand-pink px-2 py-0.5 rounded-full font-medium">{item.badge}</span>
                    )}
                  </div>
                  <p className="text-brand-charcoal/50 dark:text-white/50 text-xs mt-0.5">{item.category}</p>
                  <p className="font-bold text-brand-pink text-sm mt-1">₦{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => { setEditingId(item.id); setAddingNew(false); }}
                    className="p-2 rounded-xl hover:bg-brand-pink/10 text-brand-charcoal/50 dark:text-white/50 hover:text-brand-pink transition-colors">
                    <Pencil size={16} />
                  </button>
                  {deleteConfirm === item.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-500 font-medium">Sure?</span>
                      <button onClick={() => handleDelete(item.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-semibold">Yes</button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-xs text-brand-charcoal/50 dark:text-white/50 px-2 py-1">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(item.id)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-brand-charcoal/50 dark:text-white/50 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Reviews Tab ─────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const load = useCallback(() => setReviews(getReviews()), []);
  useEffect(() => { load(); }, [load]);

  const handleApprove = (id: string) => { approveReview(id); load(); };
  const handleReject  = (id: string) => { rejectReview(id);  load(); };
  const handleDelete  = (id: string) => { deleteReview(id);  load(); };

  const pending  = reviews.filter((r) => r.status === "pending");
  const approved = reviews.filter((r) => r.status === "approved");
  const rejected = reviews.filter((r) => r.status === "rejected");

  const displayed = filter === "all" ? reviews
    : filter === "pending"  ? pending
    : filter === "approved" ? approved
    : rejected;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-brand-charcoal/60 dark:text-white/60 text-sm">
          {pending.length} pending · {approved.length} approved · {rejected.length} rejected
        </p>
        <button onClick={load} className="flex items-center gap-1.5 bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => {
          const count = f === "all" ? reviews.length : f === "pending" ? pending.length : f === "approved" ? approved.length : rejected.length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 capitalize ${
                filter === f ? "bg-brand-pink text-white shadow-md" : "bg-white dark:bg-brand-plum/30 text-brand-charcoal dark:text-white border border-brand-pink/20 hover:border-brand-pink"
              }`}>
              {f} ({count})
            </button>
          );
        })}
      </div>

      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <Star size={40} className="text-brand-pink/30 mx-auto mb-3" />
          <p className="font-bold text-brand-plum dark:text-white mb-1">No reviews here yet</p>
          <p className="text-brand-charcoal/50 dark:text-white/50 text-sm">Customer reviews will appear here after they submit them on the website.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((r) => (
            <motion.div key={r.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-brand-plum/30 rounded-2xl border border-brand-pink/10 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <div className="w-9 h-9 rounded-full bg-brand-pink/10 flex items-center justify-center font-bold text-brand-pink text-sm shrink-0">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-brand-plum dark:text-white text-sm">{r.name}</p>
                      <p className="text-brand-charcoal/40 dark:text-white/40 text-xs">
                        {new Date(r.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={13} className={n <= r.rating ? "fill-brand-gold text-brand-gold" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      r.status === "pending"  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                      r.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                      "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-brand-charcoal/70 dark:text-white/70 text-sm leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  {r.status !== "approved" && (
                    <button onClick={() => handleApprove(r.id)}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                      <ThumbsUp size={13} /> Approve
                    </button>
                  )}
                  {r.status !== "rejected" && r.status !== "approved" && (
                    <button onClick={() => handleReject(r.id)}
                      className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                      <ThumbsDown size={13} /> Reject
                    </button>
                  )}
                  {r.status === "approved" && (
                    <button onClick={() => handleReject(r.id)}
                      className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                      <ThumbsDown size={13} /> Remove
                    </button>
                  )}
                  <button onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-brand-charcoal/40 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState<"orders" | "menu" | "reviews">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | Order["status"]>("all");

  const loadOrders = useCallback(() => setOrders(getOrders()), []);
  useEffect(() => { if (authed) loadOrders(); }, [authed, loadOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPwError(""); }
    else setPwError("Incorrect password. Please try again.");
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-brand-cream dark:bg-gray-950">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-brand-plum/40 rounded-3xl p-8 shadow-2xl border border-brand-pink/20 w-full max-w-sm">
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
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff password"
                className="w-full px-4 py-3 rounded-2xl border border-brand-pink/20 focus:border-brand-pink focus:outline-none bg-brand-cream dark:bg-white/10 text-brand-charcoal dark:text-white"
                autoFocus />
              {pwError && <p className="text-red-400 text-xs mt-2">{pwError}</p>}
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
          <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-plum dark:text-white">Admin Dashboard</h1>
          <p className="text-brand-charcoal/50 dark:text-white/50 text-sm mt-1">Darla&apos;s Foods Staff Panel</p>
        </div>
        <div className="flex items-center gap-3">
          {tab === "orders" && (
            <button onClick={loadOrders}
              className="flex items-center gap-2 bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink font-semibold px-4 py-2 rounded-xl transition-colors text-sm">
              <RefreshCw size={15} /> Refresh
            </button>
          )}
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-500 font-semibold px-4 py-2 rounded-xl transition-colors text-sm">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white dark:bg-brand-plum/20 p-1.5 rounded-2xl w-fit border border-brand-pink/10 flex-wrap">
        <button onClick={() => setTab("orders")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === "orders" ? "bg-brand-pink text-white shadow-md" : "text-brand-charcoal dark:text-white hover:text-brand-pink"}`}>
          <ShoppingBag size={16} /> Orders {newOrders.length > 0 && <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">{newOrders.length}</span>}
        </button>
        <button onClick={() => setTab("menu")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === "menu" ? "bg-brand-pink text-white shadow-md" : "text-brand-charcoal dark:text-white hover:text-brand-pink"}`}>
          <UtensilsCrossed size={16} /> Menu Editor
        </button>
        <button onClick={() => setTab("reviews")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${tab === "reviews" ? "bg-brand-pink text-white shadow-md" : "text-brand-charcoal dark:text-white hover:text-brand-pink"}`}>
          <Star size={16} /> Reviews
        </button>
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={ShoppingBag} label="Total Orders" value={String(orders.length)} color="bg-brand-pink/10 text-brand-pink" />
            <StatCard icon={ShoppingBag} label="New Orders" value={String(newOrders.length)} color="bg-blue-100 text-blue-600" />
            <StatCard icon={Users} label="Today's Orders" value={String(todayOrders.length)} color="bg-purple-100 text-purple-600" />
            <StatCard icon={DollarSign} label="Revenue" value={`₦${Math.round(totalRevenue / 1000)}k`} color="bg-green-100 text-green-600" />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
            {(["all", "new", "preparing", "delivering", "delivered", "cancelled"] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${filterStatus === s ? "bg-brand-pink text-white shadow-md" : "bg-white dark:bg-brand-plum/30 text-brand-charcoal dark:text-white border border-brand-pink/20 hover:border-brand-pink"}`}>
                {s === "all" ? `All (${orders.length})` : `${STATUS_CONFIG[s].label} (${orders.filter((o) => o.status === s).length})`}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Eye size={48} className="text-brand-pink/30 mx-auto mb-4" />
              <p className="font-bold text-brand-plum dark:text-white text-lg mb-2">
                {orders.length === 0 ? "No orders yet" : "No orders in this category"}
              </p>
              <p className="text-brand-charcoal/50 dark:text-white/50 text-sm">
                {orders.length === 0 ? "Orders from customers will appear here once they check out." : "Try a different filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => (
                <OrderCard key={order.id} order={order} onRefresh={loadOrders} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Menu Tab */}
      {tab === "menu" && <MenuTab />}

      {/* Reviews Tab */}
      {tab === "reviews" && <ReviewsTab />}
    </div>
  );
}
