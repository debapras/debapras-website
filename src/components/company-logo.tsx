import type { Role } from "@/lib/content";

export function CompanyLogo({
  logo,
  size = "md",
}: {
  logo: Role["logo"];
  size?: "md" | "sm";
}) {
  const compact = size === "sm";

  if (logo.fit === "badge") {
    return (
      <span
        className={`inline-flex shrink-0 overflow-hidden shadow-sm ring-1 ring-zinc-200/90 dark:ring-white/20 ${
          compact ? "h-9 w-9 rounded-xl" : "h-12 w-12 rounded-2xl"
        }`}
      >
        <img src={logo.src} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center ${compact ? "h-9" : "h-12"}`}
    >
      <img
        src={logo.src}
        alt=""
        className={compact ? "h-7 w-auto" : "h-10 w-auto"}
      />
    </span>
  );
}
