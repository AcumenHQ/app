"use client";

import { useState } from "react";

interface CopyAddressProps {
  address: string;
  displayAddress?: string;
  className?: string;
  showFullAddress?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

export function CopyAddress({
  address,
  displayAddress,
  className = "",
  showFullAddress = false,
  iconSize = "sm",
}: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(address);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = address;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  const displayText =
    displayAddress ||
    (showFullAddress
      ? address
      : `${address.slice(0, 6)}...${address.slice(-4)}`);

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm">{displayText}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95"
        title={copied ? "Copied!" : "Copy full address"}
        disabled={copied}
      >
        {copied ? (
          <svg
            className={`${iconSizeClasses[iconSize]} text-green-500 animate-pulse`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className={`${iconSizeClasses[iconSize]} text-muted-foreground hover:text-foreground`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
