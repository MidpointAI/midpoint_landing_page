import HeroV2 from "@/components/v2/hero-v2";
import CustomerStories from "@/components/v2/customer-stories";
import BuiltForBuilders from "@/components/v2/built-for-builders";
import WhyDeeper from "@/components/v2/why-deeper";
import HowItWorksV2 from "@/components/v2/how-it-works-v2";
import FinalCta from "@/components/v2/final-cta";

export default function Home() {
  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <HeroV2 />
      <CustomerStories />
      <BuiltForBuilders />
      <WhyDeeper />
      <HowItWorksV2 />
      <FinalCta />
    </main>
  );
}
