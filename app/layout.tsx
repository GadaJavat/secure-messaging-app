import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DES-CBC Secure Messaging Demo",
  description: "Classroom demonstration of DES-CBC message encryption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
