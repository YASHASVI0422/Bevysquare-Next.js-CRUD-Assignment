import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Users",
  description: "User management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
