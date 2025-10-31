"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { useTheme } from "next-themes";
export default function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID!} // <-- Add this in your .env.local
      config={{
        loginMethods: ["email", "wallet"],
        appearance: { theme: resolvedTheme as "light" | "dark", accentColor: "#6f46be" },
        embeddedWallets: {
          ethereum: { createOnLogin: "all-users" },
          solana: { createOnLogin: "all-users" },
        },
      }
      }
    >
      {children}
    </PrivyProvider>
  );
}