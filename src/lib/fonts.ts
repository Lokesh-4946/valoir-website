import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

// Display: a strong grotesque, in the Neue Montreal / General Sans family of feel.
// Loaded via next/font for zero layout shift.
export const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

// Mono: labels, eyebrows, code, the terminal voice of the product.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});
