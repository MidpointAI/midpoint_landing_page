import HeroV2 from "@/components/v2/hero-v2";
import BuilderTestimonials from "@/components/v2/builder-testimonials";
import BuiltForBuilders from "@/components/v2/built-for-builders";
import WhyDeeper from "@/components/v2/why-deeper";
import HowItWorksV2 from "@/components/v2/how-it-works-v2";
import FooterV2 from "@/components/v2/footer-v2";

export default function Home() {
  return (
    <main className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen">
      <HeroV2 />
      <BuilderTestimonials />
      <BuiltForBuilders />
      <WhyDeeper />
      <div className="md:snap-start md:min-h-[100dvh] md:flex md:flex-col">
        <HowItWorksV2 />
        <FooterV2 />
      </div>
    </main>
  );
}
