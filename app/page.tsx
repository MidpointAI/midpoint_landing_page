import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import StatementSection from "@/components/statement-section";
import CoiAnalysisShowcase from "@/components/coi-analysis-showcase";
import StatsSection from "@/components/stats-section";
import Testimonials from "@/components/testimonials";
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
      <StatsSection />
      <Testimonials />
      <CtaSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
