import HeroV2 from "@/components/v2/hero-v2";
import BuilderTestimonials from "@/components/v2/builder-testimonials";
import BuiltForBuilders from "@/components/v2/built-for-builders";
import HowItWorksV2 from "@/components/v2/how-it-works-v2";
import FinalCta from "@/components/v2/final-cta";

export default function Home() {
  return (
    <main className="relative bg-background text-foreground min-h-screen">
      <HeroV2 />
      <BuilderTestimonials />
      <BuiltForBuilders />
      <HowItWorksV2 />
      <FinalCta />
    </main>
  );
}
