import React from "react";

interface CivicPaeteLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  theme?: "dark" | "light";
}

export function CivicPaeteLogo({
  className = "",
  size = "md",
  variant = "full",
  theme = "dark",
}: CivicPaeteLogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
  }[size];

  const textSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  const subtextSize = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon Emblem */}
      <div className={`relative ${iconDimensions} shrink-0`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer 'C' arc container */}
          <path
            d="M 60 10 A 50 50 0 1 0 110 60 L 96 60 A 36 36 0 1 1 60 24 A 36 36 0 0 1 93 46 L 105 35 A 50 50 0 0 0 60 10 Z"
            fill="currentColor"
            className={theme === "dark" ? "text-white" : "text-slate-900"}
          />

          {/* Mountains in background */}
          <polygon
            points="28,58 45,36 60,54 75,34 94,58"
            fill="#3B82F6"
            opacity="0.8"
          />

          {/* Paete Church Facade & Belfry */}
          <path
            d="M 42 75 L 42 54 L 54 44 L 54 36 L 58 36 L 58 32 L 62 32 L 62 36 L 66 36 L 66 44 L 78 54 L 78 75 Z"
            fill="currentColor"
            className={theme === "dark" ? "text-white" : "text-slate-800"}
          />
          {/* Church Cross */}
          <rect x="58" y="26" width="4" height="7" fill="#60A5FA" />
          <rect x="55" y="28" width="10" height="3" fill="#60A5FA" />
          {/* Church Arch Doorway */}
          <path
            d="M 54 75 L 54 64 A 6 6 0 0 1 66 64 L 66 75 Z"
            fill="#0A1931"
          />

          {/* Speech / Community Bubble */}
          <path
            d="M 76 30 C 76 26.7 79 24 83 24 L 97 24 C 101 24 104 26.7 104 30 L 104 37 C 104 40.3 101 43 97 43 L 88 43 L 83 48 L 84 43 C 79 43 76 40.3 76 37 Z"
            fill="#3B82F6"
          />
          {/* Three dots inside bubble */}
          <circle cx="85" cy="33.5" r="1.5" fill="#FFFFFF" />
          <circle cx="90" cy="33.5" r="1.5" fill="#FFFFFF" />
          <circle cx="95" cy="33.5" r="1.5" fill="#FFFFFF" />

          {/* Map Location Pin */}
          <path
            d="M 88 56 C 88 51.5 92 48 96 48 C 100 48 104 51.5 104 56 C 104 62 96 72 96 72 C 96 72 88 62 88 56 Z"
            fill="currentColor"
            className={theme === "dark" ? "text-white" : "text-slate-900"}
          />
          <circle cx="96" cy="56" r="3.2" fill="#2563EB" />

          {/* Laguna de Bay Waves */}
          <path
            d="M 32 78 C 45 74 55 82 70 78 C 85 74 95 81 106 77 C 98 83 82 86 68 83 C 54 80 44 84 32 78 Z"
            fill="#2563EB"
          />
          <path
            d="M 36 84 C 50 81 60 88 74 84 C 88 80 96 86 104 83 C 94 89 80 91 66 88 C 50 85 43 89 36 84 Z"
            fill="#60A5FA"
          />
        </svg>
      </div>

      {/* Typography Wordmark */}
      {variant === "full" && (
        <div className="flex flex-col">
          <div className={`font-extrabold tracking-tight leading-none ${textSize}`}>
            <span className={theme === "dark" ? "text-white" : "text-slate-900"}>
              CIVIC
            </span>{" "}
            <span className="text-blue-500">PAETE</span>
          </div>
          <span
            className={`font-semibold tracking-wider text-slate-400 uppercase mt-0.5 leading-tight ${subtextSize}`}
          >
            Paete, Laguna
          </span>
        </div>
      )}
    </div>
  );
}
