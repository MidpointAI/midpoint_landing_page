import { PageHeader } from "@/components/page-header";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/**
 * Shared shell for legal pages: the standard page header, a short
 * contents list, and consistently styled sections.
 */
export default function LegalArticle({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PageHeader eyebrow={eyebrow} title={title} description={intro} />
      <div className="container-prose pb-20 md:pb-28">
        <p className="eyebrow mb-8">Last updated {updated}</p>
        <nav aria-label="Contents" className="mb-12 rounded-xl border border-border bg-card p-5">
          <p className="eyebrow mb-3">Contents</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="font-mono text-xs text-muted-foreground/60 mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="space-y-12 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_li]:text-muted-foreground [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_p+p]:mt-4 [&_p+ul]:mt-4 [&_ul+p]:mt-4 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="heading-3 text-foreground mb-4">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
