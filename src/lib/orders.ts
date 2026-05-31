export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  delivery: {
    address: string;
    city: string;
    landmark: string;
    notes: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: "new" | "preparing" | "delivering" | "delivered" | "cancelled";
}

export const WHATSAPP_NUMBERS = ["2347054170256", "2349056557828"];

export function saveOrder(order: Order): void {
  try {
    const existing = getOrders();
    existing.unshift(order);
    localStorage.setItem("darlas-orders", JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem("darlas-orders");
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export function updateOrderStatus(id: string, status: Order["status"]): void {
  try {
    const orders = getOrders();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) {
      orders[idx].status = status;
      localStorage.setItem("darlas-orders", JSON.stringify(orders));
    }
  } catch {
    // ignore
  }
}

export function buildWhatsAppMessage(order: Order): string {
  const paymentLabels: Record<string, string> = {
    card: "Debit/Credit Card",
    transfer: "Bank Transfer",
    ussd: "USSD",
    pod: "Pay on Delivery",
  };

  const itemLines = order.items
    .map((i) => `  • ${i.name} ×${i.quantity} — ₦${i.total.toLocaleString()}`)
    .join("\n");

  return encodeURIComponent(
    `🍽️ *NEW ORDER — Darla's Foods*\n\n` +
      `📋 Order ID: *${order.id}*\n` +
      `🕐 Time: ${new Date(order.createdAt).toLocaleString("en-NG")}\n\n` +
      `👤 *CUSTOMER*\n` +
      `  Name: ${order.customer.name}\n` +
      `  Phone: ${order.customer.phone}\n` +
      `  Email: ${order.customer.email}\n\n` +
      `📍 *DELIVERY ADDRESS*\n` +
      `  ${order.delivery.address}\n` +
      `  ${order.delivery.city}\n` +
      (order.delivery.landmark ? `  Landmark: ${order.delivery.landmark}\n` : "") +
      (order.delivery.notes ? `  Notes: ${order.delivery.notes}\n` : "") +
      `\n🛒 *ORDER ITEMS*\n${itemLines}\n\n` +
      `💰 Subtotal: ₦${order.subtotal.toLocaleString()}\n` +
      (order.discount > 0 ? `🎉 Discount: -₦${order.discount.toLocaleString()}\n` : "") +
      `🚚 Delivery: ${order.deliveryFee === 0 ? "Free" : "₦" + order.deliveryFee.toLocaleString()}\n` +
      `💵 *TOTAL: ₦${order.total.toLocaleString()}*\n\n` +
      `💳 Payment: ${paymentLabels[order.paymentMethod] ?? order.paymentMethod}\n\n` +
      `_Please confirm this order as soon as possible._`
  );
}

export function formatPrice(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}
