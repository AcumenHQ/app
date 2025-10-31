import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Poppins } from "next/font/google";
import PrivyClientProvider from "@/lib/privyClientProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Acumen - Solana Prediction & Education Platform",
  description:
    "Trade on the outcomes of future events. Connect your wallet to start predicting and earning.",
  keywords: "prediction, marketplace, trading, events, blockchain, Web3",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased`} suppressHydrationWarning={true}>
        <PrivyClientProvider>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </PrivyClientProvider>
      </body>
    </html>
  );
}
