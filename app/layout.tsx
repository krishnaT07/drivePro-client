"use client";

import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/context/AuthContext";
import { loadScript } from "@/lib/utils";
import { Inter, Poppins } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Loader2 } from "lucide-react";

// Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount) => failureCount < 3,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: { retry: 1 },
  },
});

// Root Layout
export default function RootLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([
          loadScript("https://checkout.razorpay.com/v1/checkout.js"),
        ]);
        await new Promise((res) => setTimeout(res, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <motion.div
                  key="app"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-screen"
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>

            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
