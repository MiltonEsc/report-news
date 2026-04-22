import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monitoreo de Seguridad | Malambo",
  description:
    "Panel de monitoreo de seguridad conectado a n8n para consultar noticias recientes de Malambo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
