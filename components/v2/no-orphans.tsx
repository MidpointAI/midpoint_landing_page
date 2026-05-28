/**
 * Glues the final `last` words of a string together with non-breaking
 * spaces so they always sit on the same line. This prevents the last
 * line of a paragraph from holding 1 or 2 word "orphans".
 *
 * Use for any body copy that's important enough to keep typographically
 * tight (headlines, hero copy, marketing paragraphs). CSS `text-wrap:
 * pretty` (set globally in globals.css) handles widow/orphan-prevention
 * on its own when supported, but this component is the deterministic
 * fallback for hard cases and older browsers.
 *
 *   <NoOrphans>{step.body}</NoOrphans>
 *   <NoOrphans last={4}>{title}</NoOrphans>
 */
export default function NoOrphans({
  children,
  last = 3,
}: {
  children: string;
  last?: number;
}) {
  if (typeof children !== "string") return <>{children}</>;

  const words = children.trim().split(/\s+/);
  if (words.length <= last) return <>{children}</>;

  const head = words.slice(0, words.length - last).join(" ");
  const tail = words.slice(-last).join(" "); // non-breaking spaces
  return <>{head} {tail}</>;
}
