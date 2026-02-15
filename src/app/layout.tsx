import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkFlow | Encurtador Universal",
  description: "Gere links curtos e universais que funcionam em qualquer lugar. Simples, rápido e gratuito.",
  keywords: ["LinkFlow", "encurtador de links", "URL shortener", "links curtos", "redirecionamento"],
  authors: [{ name: "LinkFlow" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>",
  },
  openGraph: {
    title: "LinkFlow - Encurtador Universal",
    description: "Gere links curtos e universais que funcionam em qualquer lugar.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkFlow - Encurtador Universal",
    description: "Gere links curtos e universais que funcionam em qualquer lugar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
