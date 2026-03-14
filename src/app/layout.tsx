import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./components.css";

export const metadata: Metadata = {
  title: "PsicoApp | Gestão Clínica Modular",
  description: "Acompanhamento terapêutico especializado para adolescentes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PsicoApp",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
