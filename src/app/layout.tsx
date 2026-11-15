import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { AppStoreProvider } from "@/shared/contexts/app-store-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ki Bubble — Operação & Gestão",
  description:
    "Plataforma integrada de vendas, pedidos, estoque de ingredientes e relatórios gerenciais Ki Bubble.",
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var raw = window.localStorage.getItem('kibubble:v1:store');
    var theme = null;
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && (parsed.theme === 'light' || parsed.theme === 'dark')) {
        theme = parsed.theme;
      }
    }
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <AppStoreProvider>{children}</AppStoreProvider>
      </body>
    </html>
  );
}
