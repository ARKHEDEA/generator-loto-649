import { cn } from "@/lib/utils";

interface LotteryBallProps {
  number: number;
  variant?: "primary" | "dim" | "success";
  size?: "sm" | "md" | "lg";
  delay?: number;
}

export const LotteryBall = ({ 
  number, 
  variant = "primary", 
  size = "md",
  delay = 0 
}: LotteryBallProps) => {
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-xl",
    lg: "w-16 h-16 text-2xl",
  };

  const variantClasses = {
    primary: "lottery-ball",
    dim: "lottery-ball-dim",
    success: "lottery-ball bg-success text-success-foreground",
  };

  return (
    <div 
      className={cn(
        "animate-scale-in",
        variantClasses[variant],
        sizeClasses[size]
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: "backwards"
      }}
    >
      <span className="relative z-10 font-bold">
        {number.toString().padStart(2, '0')}
      </span>
    </div>
  );
};
