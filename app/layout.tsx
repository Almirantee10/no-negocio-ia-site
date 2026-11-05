import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "No Negócio IA — Mais eficiência com IA",
  description:
    "Sites, dashboards, cardápios digitais, automações e agentes de IA para você ganhar tempo, organizar processos e vender mais.",
};

export const viewport: Viewport = { themeColor: "#F7F6F2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
