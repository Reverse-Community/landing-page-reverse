import Link from "next/link";

type LegalPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PlainLegalContent({ content }: { content: string }) {
  return (
    <>
      {content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
          const [heading, ...bodyLines] = block.split("\n").map((line) => line.trim()).filter(Boolean);
          const body = bodyLines.join(" ");

          if (!body) return <p key={block}>{heading}</p>;

          return (
            <section key={block}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          );
        })}
    </>
  );
}

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-base px-5 py-16 text-ink sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-black uppercase tracking-[0.22em] text-blue-reverse">← Reverse</Link>
        <h1 className="mt-8 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-white/70">{description}</p>
        <article className="glass mt-10 space-y-5 rounded-3xl p-7 leading-8 text-white/72 [&_h2]:pt-3 [&_h2]:text-2xl [&_h2]:font-black [&_p]:text-white/70">
          {children}
        </article>
      </div>
    </main>
  );
}
