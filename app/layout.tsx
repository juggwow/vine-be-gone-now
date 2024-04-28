import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { AlertAndLoading } from "./components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "เถาวัลย์จงหายไป",
  description: "ช่วยแจ้งสิ่งผิดปกติในระบบไฟฟ้ากันเถอะ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      <body className={inter.className}>
        <SessionProvider>
          <AlertAndLoading>{children}</AlertAndLoading>
        </SessionProvider>
      </body>
    </html>
  );
}
