"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Truck,
  Leaf,
  DollarSign,
  Award,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { bestSellers, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { submitReview, getApprovedReviews, type Review } from "@/lib/reviews";

// Default testimonials shown before any customer reviews are approved
const DEFAULT_TESTIMONIALS = [
  {
    name: "Adaeze Okonkwo",
    rating: 5,
    text: "Darla's meatpie is absolutely divine! The flaky crust and rich filling — I've never had anything like it in Benin. Orders delivered fresh every single time.",
  },
  {
    name: "Emeka Chukwu",
    rating: 5,
    text: "The sausage rolls are incredible! Perfectly seasoned filling in that flaky pastry. My family now orders from Darla's every weekend. Quality is consistently premium.",
  },
  {
    name: "Fatima Hassan",
    rating: 5,
    text: "Fast delivery, warm food, authentic taste! Darla's is my go-to for special occasions and everyday cravings. The Chapman drink is so refreshing and pairs perfectly!",
  },
];

const valueProps = [
  { icon: Leaf,       title: "Fresh Ingredients",  desc: "We source only the finest, freshest produce and premium cuts — no compromise on quality, ever." },
  { icon: Truck,      title: "Fast Delivery",       desc: "Hot meals delivered to your door in under 45 minutes across Benin." },
  { icon: DollarSign, title: "Affordable Pricing",  desc: "Premium taste at fair prices. Great food shouldn't break the bank." },
  { icon: Award,      title: "Quality Service",     desc: "Every order is packed with care and backed by our 100% satisfaction guarantee." },
];

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${n} star${n !== 1 ? "s" : ""}`}
        >
          <Star
            size={28}
            className={
              n <= (hovered || value)
                ? "fill-brand-gold text-brand-gold"
                : "text-gray-300 dark:text-white/20"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review | typeof DEFAULT_TESTIMONIALS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6 text-white flex flex-col gap-4"
    >
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < review.rating ? "fill-brand-gold text-brand-gold" : "text-white/20"}
          />
        ))}
      </div>
      <p className="text-white/90 text-sm leading-relaxed italic flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm uppercase shrink-0">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm">{review.name}</p>
          <p className="text-white/60 text-xs">Verified Customer</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, text: "" });
  const [reviewError, setReviewError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setApprovedReviews(getApprovedReviews());
  }, []);

  const displayedReviews =
    approvedReviews.length > 0 ? approvedReviews : DEFAULT_TESTIMONIALS;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim()) { setReviewError("Please enter your name."); return; }
    if (reviewForm.rating === 0) { setReviewError("Please select a star rating."); return; }
    if (reviewForm.text.trim().length < 10) { setReviewError("Please write at least 10 characters."); return; }
    setReviewError("");
    submitReview({ name: reviewForm.name.trim(), rating: reviewForm.rating, text: reviewForm.text.trim() });
    setSubmitted(true);
    setReviewForm({ name: "", rating: 0, text: "" });
  };

  return (
    <>
      {/* ——— HERO ——— */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient dark:bg-dark-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <motion.div animate={{ y: [0, 20, 0], x: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-20 left-10 w-48 h-48 bg-brand-gold/20 rounded-full blur-2xl" />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/20 rounded-full blur-lg" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-0 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-white">
            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/30">
              🌟 Benin&apos;s Most Loved Food Brand
            </motion.span>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Darla&apos;s <span className="text-brand-gold drop-shadow-lg">Foods</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">Where Every Bite Tells a Story</p>
            <p className="text-white/75 text-base md:text-lg mb-10 max-w-md leading-relaxed">
              Indulge in our legendary golden-crust <strong className="text-white">Meatpie</strong> and vibrant{" "}
              <strong className="text-white">Sausage Rolls</strong> — crafted fresh daily with premium ingredients and served with pure love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary text-base px-8 py-4 bg-white text-brand-pink hover:bg-brand-gold hover:text-brand-plum">
                Order Now
              </Link>
              <Link href="/menu" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-brand-pink transition-all duration-300">
                View Menu
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="text-center"><div className="font-bold text-2xl">5K+</div><div className="text-white/70 text-xs">Happy Customers</div></div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center"><div className="font-bold text-2xl">4.9★</div><div className="text-white/70 text-xs">Average Rating</div></div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center"><div className="font-bold text-2xl">45min</div><div className="text-white/70 text-xs">Avg. Delivery</div></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex justify-center">
            <div className="relative">
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/meatpie.jpg" alt="Darla's Signature Meatpie" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0], x: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-12 w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden border-3 border-white/40 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sausage-rolls.jpg" alt="Darla's Sausage Rolls" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-brand-gold text-brand-gold" />
                  <span className="font-bold text-brand-plum text-sm">4.9</span>
                </div>
                <p className="text-brand-charcoal/60 text-xs">Top Rated</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— PROMO TICKER ——— */}
      <section className="bg-brand-plum py-5 overflow-hidden">
        <motion.div animate={{ x: [0, -100, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-16 whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-white font-medium text-sm">
              🎉 Use code <strong className="text-brand-gold">DARLA20</strong> for 20% off your first order &nbsp;•&nbsp; Free delivery on orders above ₦5,000 &nbsp;•&nbsp; New menu items every week
            </span>
          ))}
        </motion.div>
      </section>

      {/* ——— PROMO CARD ——— */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-hero-gradient p-8 md:p-12 text-white text-center shadow-2xl">
          <div className="absolute inset-0 bg-brand-plum/20" />
          <div className="relative z-10">
            <p className="text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Limited Time Offer</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">First Order? Save 20%!</h2>
            <p className="text-white/85 text-lg mb-6 max-w-xl mx-auto">
              Use code <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-xl font-bold">DARLA20</span> at checkout and enjoy 20% off your first Darla&apos;s Foods order.
            </p>
            <Link href="/menu" className="inline-block bg-white text-brand-pink font-bold px-8 py-4 rounded-2xl hover:bg-brand-gold hover:text-brand-plum transition-all duration-300 shadow-lg">
              Claim Your Discount
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ——— BEST SELLERS ——— */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-brand-pink font-semibold uppercase tracking-widest text-sm mb-3">Customer Favourites</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-heading mb-4">Our Best Sellers</motion.h2>
          <p className="section-sub max-w-xl mx-auto">The dishes our customers can&apos;t stop ordering — crafted fresh daily with premium ingredients.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {bestSellers.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/menu" className="btn-secondary inline-flex items-center gap-2">View Full Menu <ChevronRight size={18} /></Link>
        </div>
      </section>

      {/* ——— WHY CUSTOMERS LOVE US ——— */}
      <section className="bg-white dark:bg-brand-plum/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand-pink font-semibold uppercase tracking-widest text-sm mb-3">Our Promise</p>
            <h2 className="section-heading mb-4">Why Customers Love Us</h2>
            <p className="section-sub max-w-xl mx-auto">Every aspect of your experience is designed to delight.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((vp, i) => (
              <motion.div key={vp.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-brand-pink/10 dark:bg-brand-pink/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-pink transition-colors duration-300">
                  <vp.icon size={28} className="text-brand-pink group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-brand-plum dark:text-white text-lg mb-3">{vp.title}</h3>
                <p className="text-brand-charcoal/65 dark:text-white/65 text-sm leading-relaxed">{vp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— ABOUT US ——— */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" alt="Darla's Foods Kitchen" fill className="object-cover" />
                <div className="absolute inset-0 bg-hero-gradient/30" />
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-brand-plum rounded-2xl p-5 shadow-xl border border-brand-pink/10">
                <p className="font-display font-bold text-brand-plum dark:text-white text-2xl">10+</p>
                <p className="text-brand-charcoal/60 dark:text-white/60 text-xs">Years of Excellence</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-brand-pink font-semibold uppercase tracking-widest text-sm mb-4">Our Story</p>
            <h2 className="section-heading mb-6">Crafted with Passion, <span className="text-gradient">Served with Love</span></h2>
            <p className="text-brand-charcoal/70 dark:text-white/70 mb-5 leading-relaxed">
              Darla&apos;s Foods was born from a simple belief: that great food is the foundation of great memories. Founded over a decade ago in the heart of Benin, we started with a single recipe — a golden, flaky meatpie that made everyone who tasted it stop and smile.
            </p>
            <p className="text-brand-charcoal/70 dark:text-white/70 mb-5 leading-relaxed">
              Today, our kitchen is built on the same philosophy — fresh ingredients sourced daily, recipes perfected over years, and a team that pours genuine care into every single dish.
            </p>
            <p className="text-brand-charcoal/70 dark:text-white/70 mb-8 leading-relaxed">
              Whether you&apos;re treating yourself on a weekday afternoon or ordering for a celebration, at Darla&apos;s, every bite is a moment of pure joy.
            </p>
            <Link href="/menu" className="btn-primary inline-flex items-center gap-2">Explore Our Menu <ChevronRight size={18} /></Link>
          </motion.div>
        </div>
      </section>

      {/* ——— TESTIMONIALS + REVIEW FORM ——— */}
      <section className="bg-hero-gradient dark:bg-dark-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 text-white">
            <p className="font-semibold uppercase tracking-widest text-sm mb-3 text-white/80">Customer Reviews</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">What Our Customers Say</h2>
            <p className="text-white/70 text-sm">
              {approvedReviews.length > 0
                ? `${approvedReviews.length} verified customer review${approvedReviews.length !== 1 ? "s" : ""}`
                : "Be the first to leave a review below!"}
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {displayedReviews.slice(0, 6).map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>

          {/* Review Submission Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass rounded-3xl p-8 text-white">
              <h3 className="font-display font-bold text-2xl mb-2 text-center">Share Your Experience</h3>
              <p className="text-white/70 text-sm text-center mb-8">
                Loved your order? Leave a review — it will appear on the site after a quick check by our team.
              </p>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                    <p className="font-bold text-xl mb-2">Thank you for your review!</p>
                    <p className="text-white/70 text-sm">Your review is awaiting approval and will be published soon.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-white/70 hover:text-white text-sm underline transition-colors"
                    >
                      Submit another review
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleReviewSubmit} className="space-y-5">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">Your Name *</label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        placeholder="e.g. Adaeze from Lagos"
                        className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">Star Rating *</label>
                      <StarPicker value={reviewForm.rating} onChange={(n) => setReviewForm({ ...reviewForm, rating: n })} />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">Your Review *</label>
                      <textarea
                        value={reviewForm.text}
                        onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                        placeholder="Tell us about your experience with Darla's Foods..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-all resize-none"
                      />
                    </div>

                    {reviewError && (
                      <p className="text-red-300 text-sm font-medium">{reviewError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-white text-brand-pink font-bold py-4 rounded-2xl hover:bg-brand-gold hover:text-brand-plum transition-all duration-300 shadow-lg"
                    >
                      <Send size={18} /> Submit Review
                    </button>

                    <p className="text-white/50 text-xs text-center">
                      Reviews are checked by our team before going live. We appreciate your honest feedback!
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ——— CONTACT ——— */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-brand-pink font-semibold uppercase tracking-widest text-sm mb-3">Get in Touch</p>
          <h2 className="section-heading mb-4">Contact Us</h2>
          <p className="section-sub">We&apos;re always happy to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Phone,  label: "Phone & WhatsApp", value: "+234 7054170256",                         href: "tel:+2347054170256" },
            { icon: Mail,   label: "Email Us",         value: "hello@darlafoods.com",                    href: "mailto:hello@darlafoods.com" },
            { icon: MapPin, label: "Find Us",          value: "Benin City, Edo State",                   href: "#" },
            { icon: Clock,  label: "Business Hours",   value: "Mon–Sun: 8am – 10pm",                     href: "#" },
          ].map((item) => (
            <motion.a key={item.label} href={item.href}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }}
              className="bg-white dark:bg-brand-plum/40 rounded-3xl p-6 text-center shadow-md border border-brand-pink/10 hover:border-brand-pink/40 transition-all cursor-pointer block">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={22} className="text-brand-pink" />
              </div>
              <p className="font-bold text-brand-plum dark:text-white text-sm mb-1">{item.label}</p>
              <p className="text-brand-charcoal/60 dark:text-white/60 text-sm">{item.value}</p>
            </motion.a>
          ))}
        </div>
      </section>
    </>
  );
}
