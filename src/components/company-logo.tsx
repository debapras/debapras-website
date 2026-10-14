import type { Role } from "@/lib/content";

export function CompanyLogo({
  logo,
  size = "md",
}: {
  logo: Role["logo"];
  size?: "md" | "sm" | "xs";
}) {
  const frame =
    size === "xs"
      ? "h-5 w-5 rounded-md"
      : size === "sm"
        ? "h-9 w-9 rounded-xl"
        : "h-12 w-12 rounded-2xl";

  if (logo.fit === "badge") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden shadow-sm ring-1 ring-zinc-200/90 dark:ring-white/20 ${frame}`}
      >
        <img src={logo.src} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center ${size === "xs" ? "h-5" : size === "sm" ? "h-9" : "h-12"}`}
    >
      <img
        src={logo.src}
        alt=""
        className={size === "xs" ? "h-4 w-auto" : size === "sm" ? "h-7 w-auto" : "h-10 w-auto"}
      />
    </span>
  );
}
