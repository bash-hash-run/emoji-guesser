import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FarcasterProvider } from "./components/FarcasterProvider";
import { WagmiProvider } from "./components/WagmiProvider";
import { metadata } from "./metadata";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata };

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Root layout component that wraps all pages
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="fc:frame"
          content={`{
          "version": "next",
          "imageUrl": "https://emoji-guesser.vercel.app/emoji-frame.png",
          "aspectRatio": "3:2",
          "button": {
            "title": "Start Guessing",
            "action": {
              "type": "launch_frame",
              "name": "Emoji Guesser",
              "url": "https://emoji-guesser.vercel.app",
              "splashImageUrl": "https://emoji-guesser.vercel.app/emoji-splash-alt.png",
              "splashBackgroundColor": "#4338ca"
            }
          }
        }`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dots`}
      >
        {/* Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Top left circle */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-300/20 to-cyan-400/20 dark:from-emerald-700/20 dark:to-cyan-800/20 blur-3xl floating-slow"></div>

          {/* Bottom right circle */}
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-400/20 dark:from-cyan-800/20 dark:to-teal-800/20 blur-3xl floating"></div>

          {/* Emoji decorations */}
          <div className="absolute top-1/4 right-10 text-4xl opacity-20 floating-slow">
            🎮
          </div>
          <div className="absolute bottom-1/3 left-10 text-4xl opacity-20 floating">
            🎯
          </div>
          <div className="absolute top-2/3 right-1/4 text-4xl opacity-20 floating-delay">
            🧩
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <WagmiProvider>
            <FarcasterProvider>
              {children}
              <Footer />
            </FarcasterProvider>
          </WagmiProvider>
        </div>
      </body>
    </html>
  );
}
