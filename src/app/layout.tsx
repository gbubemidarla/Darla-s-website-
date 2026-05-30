import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Darla's Foods — Premium Nigerian Cuisine & Delivery",
  description:
    "Experience the finest Nigerian flavors delivered to your doorstep. Famous for our signature golden-crust Meatpie and vibrant Fried Rice. Order now!",
  keywords: "Nigerian food, meatpie, fried rice, jollof rice, food delivery, Lagos",
  openGraph: {
    title: "Darla's Foods",
    description: "Premium Nigerian cuisine delivered fresh to your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-brand-cream dark:bg-gray-950 transition-colors duration-300">
        <CartProvider>
          <Navbar />
          <main className="pt-16 md:pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
