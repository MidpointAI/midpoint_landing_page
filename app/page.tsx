import HeroV2 from "@/components/v2/hero-v2";
import BuilderTestimonials from "@/components/v2/builder-testimonials";
import BuiltForBuilders from "@/components/v2/built-for-builders";
import HowItWorksV2 from "@/components/v2/how-it-works-v2";
import FinalCta from "@/components/v2/final-cta";
import FooterV2 from "@/components/v2/footer-v2";

export default function Home() {
  return (
    <main className="relative bg-zinc-950 text-white min-h-screen">
      <HeroV2 />
      <BuilderTestimonials />
      <BuiltForBuilders />
      <HowItWorksV2 />
      <FinalCta />
      <FooterV2 />
    </main>
  );
}
