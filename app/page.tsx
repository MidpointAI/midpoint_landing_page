import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import StatementSection from "@/components/statement-section";
import CoiAnalysisShowcase from "@/components/coi-analysis-showcase";
import FastOnboardingSection from "@/components/fast-onboarding-section";
import Testimonials from "@/components/testimonials";
import PricingSection from "@/components/pricing-section";
import CtaSection from "@/components/cta-section";
import FaqSection from "@/components/faq-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <StatementSection />
      <CoiAnalysisShowcase />
      <FastOnboardingSection />
      <Testimonials />
      <PricingSection />
      <CtaSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
