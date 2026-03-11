import { TestimonialStack } from "@/components/ui/glass-testimonial-swiper";
import type { Testimonial } from "@/components/ui/glass-testimonial-swiper";

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    initials: "AB",
    name: "Andy Becker",
    role: "CEO",
    company: "STONEGATE HOMES",
    quote:
      "Before signing on, we didn't have subcontractor agreements in place, and only about 10% of trade partners carried the required insurance. Now every trade partner has an executed agreement and we're sitting at 98% compliance. It's streamlined, accountable, and a big win for our risk management.",
    avatarGradient: "linear-gradient(135deg, #56754a, #8bc671)",
  },
  {
    id: 2,
    initials: "SB",
    name: "Samantha Becher",
    role: "OFFICE & FINANCE MANAGER",
    company: "STARWOOD CUSTOM HOMES",
    quote:
      "Since Midpoint has taken over and streamlined our compliance requirements, it has significantly reduced preparation time and stress during insurance audits and also our day to day tracking. I would definitely recommend this service to any company",
    avatarGradient: "linear-gradient(135deg, #47684d, #74a35d)",
  },
  {
    id: 3,
    initials: "SN",
    name: "Spencer Nield",
    role: "DIRECTOR OF OPERATIONS",
    company: "A FINER TOUCH CONSTRUCTION",
    quote:
      "Working with Midpoint has been a game-changer for us. Their approach has reduced time spent managing the compliance process as well as dramatically reducing our exposure and insurance premiums.",
    avatarGradient: "linear-gradient(135deg, #44623f, #97cf69)",
  },
];

export default function Testimonials() {
  return (
    <section
      aria-labelledby="builder-testimonials-heading"
      className="relative w-full bg-background"
    >
      <div className="relative z-10 flex flex-col items-center px-4 py-14 md:py-20">
        <header className="mb-14 max-w-2xl text-center md:mb-16">
          <h2
            id="builder-testimonials-heading"
            className="mb-4 text-3xl font-light tracking-tight text-foreground md:text-4xl lg:text-5xl"
          >
            Builder <span className="italic text-primary">Testimonials</span>
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Real stories from contractors who transformed their risk
            management.
          </p>
        </header>

        <div className="relative flex w-full items-center justify-center pt-2 md:pt-3">
          {/* Dot pattern — large bed centered on cards, solid in core area, gradual fade outward */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[60rem] h-[50rem] -translate-x-1/2 -translate-y-[44%] md:w-[75rem] md:h-[60rem] lg:w-[90rem] lg:h-[70rem]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, color-mix(in oklch, var(--foreground) 22%, transparent) 1px, transparent 1px)",
                backgroundSize: "15px 15px",
                maskImage:
                  "radial-gradient(ellipse 55% 48% at 50% 42%, black 0%, black 18%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.25) 42%, rgba(0,0,0,0.08) 55%, transparent 65%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 55% 48% at 50% 42%, black 0%, black 18%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.25) 42%, rgba(0,0,0,0.08) 55%, transparent 65%)",
              }}
            />
          </div>

          <div className="relative z-10 flex w-full items-center justify-center">
            <TestimonialStack testimonials={testimonialsData} />
          </div>
        </div>
      </div>
    </section>
  );
}
