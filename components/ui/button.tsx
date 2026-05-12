import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400 text-slate-950 shadow-[0_0_40px_rgba(251,146,60,0.3)] hover:scale-[1.01]",
  secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  ghost: "text-slate-200 hover:bg-white/10",
  danger: "border border-red-500/30 bg-red-500/10 text-red-100 hover:bg-red-500/20",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
});

export { Button };
