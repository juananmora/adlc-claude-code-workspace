import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Inter para el body — texto largo, legible.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-inter",
});

// Cinzel = display metalero. Se carga UNA sola vez aquí y se expone
// como `--font-metal` para todo el árbol (catálogo + /albums lo
// reutilizan vía la misma variable CSS, evitando duplicar el import).
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
  variable: "--font-metal",
});

export const metadata: Metadata = {
  title: "MASTER OF THE PUPPETS — Catálogo",
  description:
    "MASTER OF THE PUPPETS: catálogo de máquinas forjadas para el combate. Portátiles, sobremesa, componentes y periféricos. No es una tienda real.",
};

/**
 * RootLayout: setea fondo negro por defecto, carga las dos fuentes
 * (Inter para body, Cinzel como display "metal") y monta el Toaster.
 *
 * Los layouts hijos deciden si montan el header IRON DECK
 * (`app/(main)/layout.tsx`) o uno propio (`app/albums/layout.tsx`).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground font-sans flex flex-col"
        suppressHydrationWarning
      >
        {children}
        <Toaster richColors position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
