import { cn } from "../../lib/utils";

const variants = {
  default: "bg-[#3f51ff] text-white shadow-[0_16px_30px_rgba(63,81,255,0.24)] hover:bg-[#3346d1]",
  ghost: "bg-transparent text-inherit hover:bg-white/12",
  soft: "bg-white/72 text-[#0b554d] ring-1 ring-[#d7e2de] hover:bg-white",
};

const sizes = {
  default: "h-11 px-5",
  icon: "h-11 w-11 p-0",
  pill: "h-12 rounded-full px-6",
};

export function Button({ className, size = "default", variant = "default", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border-0 font-extrabold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#75d7ca]/35 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
