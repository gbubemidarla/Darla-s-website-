export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

const KEY = "darlas-reviews";

export function getReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function save(reviews: Review[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

export function submitReview(
  data: Pick<Review, "name" | "rating" | "text">
): void {
  const all = getReviews();
  all.unshift({
    ...data,
    id: "rev-" + Date.now(),
    createdAt: new Date().toISOString(),
    status: "pending",
  });
  save(all);
}

export function approveReview(id: string): void {
  const all = getReviews();
  const i = all.findIndex((r) => r.id === id);
  if (i >= 0) { all[i].status = "approved"; save(all); }
}

export function rejectReview(id: string): void {
  const all = getReviews();
  const i = all.findIndex((r) => r.id === id);
  if (i >= 0) { all[i].status = "rejected"; save(all); }
}

export function deleteReview(id: string): void {
  save(getReviews().filter((r) => r.id !== id));
}

export function getApprovedReviews(): Review[] {
  return getReviews().filter((r) => r.status === "approved");
}

export function getPendingReviews(): Review[] {
  return getReviews().filter((r) => r.status === "pending");
}
