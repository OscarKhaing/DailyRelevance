export type Article = {
  title: string;
  source: string;
  url: string;
  date?: string;
  summary: string;
  relevance: string;
  tags: string[];
};

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function NewsCard({ article, index }: { article: Article; index: number }) {
  const host = hostname(article.url);
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noreferrer noopener"
      className="glass glass-hover fade-up group block rounded-2xl p-5 md:p-6"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px] text-[color:var(--color-muted)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="truncate">{article.source || host}</span>
        {article.date && (
          <>
            <span className="text-white/20">•</span>
            <span>{article.date}</span>
          </>
        )}
      </div>

      <h3 className="mt-2 text-lg md:text-xl font-semibold leading-snug text-white group-hover:text-fuchsia-100">
        {article.title}
      </h3>

      <p className="mt-2 text-sm text-[color:var(--color-ink)]/80 leading-relaxed">
        {article.summary}
      </p>

      {article.relevance && (
        <div className="mt-4 rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/5 p-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-fuchsia-300/80">
            Why this matters to you
          </div>
          <p className="mt-1 text-sm text-[color:var(--color-ink)]/90 leading-relaxed">
            {article.relevance}
          </p>
        </div>
      )}

      {article.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {article.tags.map((t) => (
            <span key={t} className="pill pill-soft">
              {t}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
