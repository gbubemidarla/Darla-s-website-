import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-plum text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="font-display font-bold text-2xl">Darla&apos;s Foods</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Bringing the finest Nigerian flavors to your doorstep. Crafted with love, served with pride.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-pink transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-brand-gold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/menu", label: "Our Menu" },
                { href: "/cart", label: "Cart" },
                { href: "/checkout", label: "Checkout" },
                { href: "/tracking", label: "Track Order" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-brand-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-brand-gold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Phone size={16} className="mt-0.5 text-brand-pink shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-brand-pink transition-colors">
                  +234 801 234 5678
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Mail size={16} className="mt-0.5 text-brand-pink shrink-0" />
                <a href="mailto:hello@darlafoods.com" className="hover:text-brand-pink transition-colors">
                  hello@darlafoods.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin size={16} className="mt-0.5 text-brand-pink shrink-0" />
                <span>12 Gourmet Lane, Victoria Island, Lagos, Nigeria</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-brand-gold">Newsletter</h4>
            <p className="text-white/70 text-sm mb-4">
              Get exclusive deals and new menu updates directly in your inbox.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-brand-pink"
              />
              <button
                type="submit"
                className="bg-brand-pink text-white font-semibold py-3 rounded-xl hover:bg-pink-600 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Darla&apos;s Foods. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            Made with love in Nigeria 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
