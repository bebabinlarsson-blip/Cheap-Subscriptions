import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
