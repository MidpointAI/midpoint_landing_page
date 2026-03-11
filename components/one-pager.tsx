"use client";

// Midpoint Logo using the actual SVG file
function MidpointLogo({
  width = 272,
  variant = "dark"
}: {
  width?: number;
  variant?: "dark" | "light"
}) {
  // The original SVG is 918x126, calculate height to maintain aspect ratio
  const height = (width / 918) * 126;

  return (
    <img
      alt="Midpoint"
      src="/Midpoint-Logo.svg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        // For light variant (footer), invert and adjust
        filter: variant === "light"
          ? "invert(1) brightness(2)"
          : "none"
      }}
    />
  );
}

// COI Document Stack - Fan left with scale effect on hover
function COIDocumentStack() {
  return (
    <div
      className="group relative flex items-center justify-center cursor-pointer"
      style={{
        width: "280px",
        height: "330px",
        marginLeft: "0px"
      }}
    >
      {/* Back document - smallest, fans furthest left */}
      <div
        className="absolute rounded-lg overflow-hidden transition-all duration-300 ease-out group-hover:scale-[0.88] group-hover:translate-x-[-55px]"
        style={{
          width: "230px",
          height: "306px",
          bottom: "15px",
          left: "25px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          transformOrigin: "right center",
          zIndex: 1
        }}
      >
        <img
          alt="Certificate of Insurance"
          className="w-full h-full object-cover"
          src="/one-pager/coi-certificate.png"
        />
      </div>

      {/* Middle document - medium size, fans slightly left */}
      <div
        className="absolute rounded-lg overflow-hidden transition-all duration-300 ease-out group-hover:scale-[0.94] group-hover:translate-x-[-28px]"
        style={{
          width: "230px",
          height: "306px",
          bottom: "15px",
          left: "25px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          transformOrigin: "right center",
          zIndex: 2
        }}
      >
        <img
          alt="Certificate of Insurance"
          className="w-full h-full object-cover"
          src="/one-pager/coi-certificate.png"
        />
      </div>

      {/* Front document - full size, stays in place */}
      <div
        className="absolute rounded-lg overflow-hidden transition-all duration-300 ease-out"
        style={{
          width: "230px",
          height: "306px",
          bottom: "15px",
          left: "25px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          zIndex: 3
        }}
      >
        <img
          alt="Certificate of Insurance"
          className="w-full h-full object-cover"
          src="/one-pager/coi-certificate.png"
        />
      </div>
    </div>
  );
}

// Simple icon components matching Figma exactly
function OrderIcon() {
  return (
    <div className="relative w-6 h-6">
      <div
        className="absolute bg-[#c9ff64] border-[#5f6159] border-[1.2px] border-solid rounded-[2px]"
        style={{ inset: "16.67% 20.83% 12.5% 20.83%" }}
      />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none">
        <line x1="9" y1="9" x2="15" y2="9" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="9" y1="13" x2="15" y2="13" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="9" y1="17" x2="13" y2="17" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function MoneyIcon() {
  return (
    <div className="relative w-6 h-6">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" fill="#c9ff64" stroke="#5f6159" strokeWidth="1.2"/>
        <line x1="6" y1="9" x2="8" y2="9" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="16" y1="15" x2="18" y2="15" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" stroke="#5f6159" strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

function DeskIcon() {
  return (
    <div className="relative w-6 h-6">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="5" width="14" height="17" rx="1" fill="#c9ff64" stroke="#5f6159" strokeWidth="1.2"/>
        <rect x="9" y="3" width="6" height="4" rx="1" fill="#c9ff64" stroke="#5f6159" strokeWidth="1.2"/>
        <line x1="9" y1="12" x2="15" y2="12" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="9" y1="16" x2="13" y2="16" stroke="#5f6159" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <div className="relative w-6 h-6">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L4 7V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V7L12 3Z"
          fill="#c9ff64"
          stroke="#5f6159"
          strokeWidth="1.2"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="#5f6159"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function OnePager({ embedded = false }: { embedded?: boolean }) {
  const page = (
    <div
      className={`relative bg-white ${embedded ? "" : "shadow-2xl"}`}
      style={{
        width: "612px",
        height: "916px",
        minWidth: "612px"
      }}
    >
        {/* Header Section - Gradient Background */}
        <div
          className="absolute left-0 top-0 w-full flex flex-col gap-[17px] items-start"
          style={{
            height: "281px",
            padding: "35px 65px 35px 45px",
            backgroundImage: "linear-gradient(146.121deg, rgb(235, 238, 225) 31.885%, rgb(211, 215, 194) 90.595%)"
          }}
        >
          <div className="flex flex-col gap-[9px] items-start w-full">
            <p
              className="text-[#5f6159] whitespace-pre-wrap"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "19.277px",
                lineHeight: 1
              }}
            >
              Understanding
            </p>
            <MidpointLogo width={272} variant="dark" />
          </div>

          <div
            className="text-black whitespace-pre-wrap w-full"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              lineHeight: 1.25
            }}
          >
            <p className="mb-0">Tracking subcontractor insurance and ensuring it meets contract requirements is tedious, and one missing form or outdated policy can put your business at risk.</p>
            <p className="mb-0">&nbsp;</p>
            <p>
              <span>MidPoint&apos;s AI-powered service automates the process, scanning, comparing, and reconciling insurance documents across all parties, projects, and work </span>
              <span className="font-bold">flagging issues before they cost you.</span>
            </p>
          </div>
        </div>

        {/* Features Section - Dark Background */}
        <div
          className="absolute left-0 w-full bg-[#1a1a19] flex gap-[60px] items-center"
          style={{
            top: "281px",
            height: "385px",
            padding: "0 35px"
          }}
        >
          {/* COI Document Stack */}
          <COIDocumentStack />

          {/* Midpoint Features */}
          <div className="flex flex-col gap-[20px] items-start shrink-0 left">
            <p
              className="text-[#c9ff64] font-bold"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "23px",
                lineHeight: 1
              }}
            >
              Midpoint:
            </p>
            <div
              className="text-white"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                lineHeight: 1.25,
                width: "254px"
              }}
            >
              <ul className="mb-0 list-disc ml-4">
                <li className="mb-2">Instantly reviews your master subcontract agreements and establishes insurance requirements, a critical step in proper risk transfer.</li>
                <li className="mb-2">Matches and verifies COI&apos;s against your projects requirements.</li>
                <li className="mb-2">Automates subcontractor outreach to reduce manual back and forth</li>
                <li className="mb-2">Alerts you to missing or outdated coverages</li>
                <li className="mb-2">Requests updated documents directly from subcontractors before they expire</li>
                <li>Surfaces policy exclusions and GL rating details you need to know to avoid costly gaps.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why It Matters Section - White Background */}
        <div
          className="absolute left-0 w-full bg-white flex flex-col gap-[19px] items-center justify-end"
          style={{
            top: "656px",
            height: "189px",
            padding: "24px 18px 36px 18px"
          }}
        >
          <div className="w-full px-[15px]">
            <p
              className="text-[#30312b] font-bold whitespace-pre-wrap"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "24px",
                lineHeight: 1
              }}
            >
              Why it matters:
            </p>
          </div>

          <div className="w-full flex flex-wrap gap-[16px] items-start px-[16px]">
            {/* Card 1 */}
            <div className="flex-1 min-w-0 flex flex-col gap-[10px] items-start">
              <OrderIcon />
              <p
                className="text-[#30312b] whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  lineHeight: 1.2
                }}
              >
                Helps reduce your liability premiums and showcases you as best in class
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex-1 min-w-0 flex flex-col gap-[10px] items-start">
              <MoneyIcon />
              <p
                className="text-[#30312b] whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  lineHeight: 1.2
                }}
              >
                Allows employees to focus to revenue generating activities.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex-1 min-w-0 flex flex-col gap-[10px] items-start">
              <DeskIcon />
              <p
                className="text-[#30312b] whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  lineHeight: 1.2
                }}
              >
                Smoother project starts and fewer delays
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex-1 min-w-0 flex flex-col gap-[10px] items-start">
              <ShieldCheckIcon />
              <p
                className="text-[#30312b] whitespace-pre-wrap"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "12px",
                  lineHeight: 1.2
                }}
              >
                Peace of mind knowing every party is covered
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section - Black Background */}
        <div
          className="absolute left-0 w-full bg-black flex flex-col items-start justify-center"
          style={{
            top: "834px",
            height: "82px",
            padding: "10px 28px"
          }}
        >
          <div className="flex flex-col gap-[4px] items-start justify-center w-full relative">
            <p
              className="text-[#f3f3f3] whitespace-pre-wrap"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "9px",
                lineHeight: 1.1
              }}
            >
              For more information or to schedule a demo contact:
            </p>
            <div
              className="flex gap-[12px] items-center h-[13px]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9.167px",
                lineHeight: 1.1
              }}
            >
              <span className="text-white">[First,Last Name]</span>
              <div className="flex gap-[4px] items-center">
                <span className="text-[#c9ff64]">OFFICE:</span>
                <span className="text-[#f5f5f5]">[Phone Number]</span>
              </div>
              <div className="flex gap-[4px] items-center">
                <span className="text-[#c9ff64]">EMAIL:</span>
                <span className="text-[#f5f5f5] underline">[&gt; Type Email Address Here &lt;]</span>
              </div>
            </div>

            {/* Footer Logo - positioned absolute right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <MidpointLogo width={98} variant="light" />
            </div>
          </div>
        </div>
    </div>
  );

  if (embedded) {
    return page;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-secondary py-8">
      {/* Fixed 612px width container - matches Figma exactly */}
      {page}
    </div>
  );
}
