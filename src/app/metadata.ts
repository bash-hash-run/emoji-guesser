import { Metadata } from "next";

/**
 * Application metadata - Farcaster Frame metadata is now in layout.tsx
 */
export const metadata: Metadata = {
  title: "Emoji Guesser",
  description:
    "Can you guess what these emojis represent? Test your emoji skills!",
  authors: [{ name: "Emoji Guesser Team" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};
