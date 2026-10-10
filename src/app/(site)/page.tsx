import { Suspense } from "react";
import { LivePortfolio } from "@/components/live-portfolio";
import { Portfolio } from "@/components/portfolio";

export default function HomePage() {
  return (
    <Suspense fallback={<Portfolio totalTenure="7+ yr" roleDurations={{}} />}>
      <LivePortfolio />
    </Suspense>
  );
}
