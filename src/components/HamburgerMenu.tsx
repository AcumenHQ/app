"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useUserStore } from "@/stores/userStore";
import { CopyAddress } from "@/components/CopyAddress";
import Link from "next/link";

interface HamburgerMenuProps {
  isConnected: boolean;
}

export function HamburgerMenu({ isConnected }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { authenticated, user, logout } = usePrivy();
  const { profile, loadUserData } = useUserStore();

  // Load user data when authenticated
  useEffect(() => {
    if (authenticated && user?.id && (!profile || profile.id !== user.id)) {
      loadUserData(user.id);
    }
  }, [authenticated, user?.id, profile, loadUserData]);

  // Use generated deposit address from Privy, not connected wallet
  const depositAddress = profile?.virtualAddress;
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      logout();
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  if (!authenticated && !isConnected) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="User menu"
      >
        <div className="w-5 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 bg-current transition-all duration-200 ${isOpen ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block h-0.5 bg-current transition-all duration-200 ${isOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`block h-0.5 bg-current transition-all duration-200 ${isOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute right-0 top-12 z-50 w-64 bg-background border border-border rounded-lg shadow-lg py-2">
            {/* Profile Section */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">
                {profile?.displayName || "Anonymous Trader"}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                {profile?.username
                  ? `@${profile.username}`
                  : depositAddress
                    ? `@user_${depositAddress.replace(/^0x/, '').slice(0, 6)}`
                    : "Wallet"}
              </p>
              {depositAddress && (
                <div className="mt-2">
                  <CopyAddress
                    address={depositAddress}
                    showFullAddress={false}
                    className="text-xs text-muted-foreground"
                    iconSize="sm"
                  />
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile"
                onClick={handleMenuItemClick}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </Link>

              <Link
                href="/account-settings"
                onClick={handleMenuItemClick}
                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Account Settings
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">✉️</span>
                    <span className="text-xs">🔒</span>
                  </div>
                </div>
              </Link>

              {/* Divider */}
              <div className="my-1 border-b border-border" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
