import { cn } from "@/lib/utils";
import logo from "@/assets/logo.webp";

type LogoSize = "sm" | "md" | "lg";

const sizeClasses: Record<LogoSize, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
};

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const Logo = ({ size = "md", className }: LogoProps) => {
  return (
    <img
      src={logo}
      alt="Tshaye Tsidq Leadership and mission College Logo"
      className={cn(
        "object-contain select-none",
        sizeClasses[size],
        className,
      )}
    />
  );
};

export default Logo;
