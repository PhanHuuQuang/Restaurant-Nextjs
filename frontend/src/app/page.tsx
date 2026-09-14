import { Suspense } from "react";
import Featured from "@/components/Featured";
import Offer from "@/components/Offer";
import Slider from "@/components/Slider";
import { FeaturedSkeleton } from "@/components/Skeleton";

export default function Home() {
  return (
    <main>
      <Slider />
      <Suspense fallback={<FeaturedSkeleton />}>
        <Featured />
      </Suspense>
      <Offer />
    </main>
  );
}
