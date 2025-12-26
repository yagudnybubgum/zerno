import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Зерно - Каталог кофе",
  description: "Каталог кофейных лотов с отзывами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}



