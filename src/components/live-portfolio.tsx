import { connection } from "next/server";
import { Portfolio } from "@/components/portfolio";
import { roles } from "@/lib/content";
import { careerStart, formatTenure } from "@/lib/tenure";

export async function LivePortfolio() {
  await connection();
  const now = new Date();
  const durations = Object.fromEntries(
    roles.map((role) => [role.id, formatTenure(role.start, role.end, now)]),
  );

  return (
    <Portfolio
      totalTenure={formatTenure(careerStart, "present", now)}
      roleDurations={durations}
    />
  );
}
