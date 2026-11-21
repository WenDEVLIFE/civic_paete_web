import Image from "next/image";

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
  const iconSize = { sm: 32, md: 44, lg: 64 }[size];

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
      <Image
        src="/logo.png"
        alt={variant === "icon" ? "Civic Paete" : ""}
        width={iconSize}
        height={iconSize}
        className="shrink-0 rounded-md"
      />

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
