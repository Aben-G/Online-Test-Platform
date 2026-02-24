import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const sizeClasses: Record<LogoSize, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const Logo = ({ size = "md", className }: LogoProps) => {
  return (
    <div
      aria-label="OT logo"
      className={cn(
        "gradient-primary text-primary-foreground inline-flex items-center justify-center rounded-xl font-display font-bold tracking-tight select-none",
        sizeClasses[size],
        className,
      )}
    >
      OT
    </div>
  );
};

export default Logo;
