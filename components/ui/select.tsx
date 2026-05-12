import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 text-sm text-white focus:border-cyan-400 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
