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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var storageKey = "report-malambo-theme";
                var storedTheme = localStorage.getItem(storageKey);
                var theme = storedTheme === "light" || storedTheme === "dark"
                  ? storedTheme
                  : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
                document.documentElement.classList.toggle("dark", theme === "dark");
                document.documentElement.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
