import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Observatorio Digital de Turismo y Clima de Alicante",
  description:
    "MVP público para tomar decisiones turísticas en Alicante basadas en clima, confort, saturación y agenda cultural.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <FloatingChatButton />
        <Footer />
      </body>
    </html>
  );
}
