export type Profile = {
  role: string;
  industry: string;
  focus: string;
  topics: string[];
};

export function ProfileSummary({ profile }: { profile: Profile }) {
  return (
    <div className="glass fade-up rounded-2xl p-5 md:p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
        Reading you as
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          <span className="gradient-text">{profile.role}</span>
        </h2>
        <span className="text-sm text-[color:var(--color-muted)]">
          · {profile.industry}
        </span>
      </div>
      {profile.focus && (
        <p className="mt-2 text-sm md:text-base text-[color:var(--color-muted)] max-w-3xl">
          {profile.focus}
        </p>
      )}
      {profile.topics?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {profile.topics.map((t) => (
            <span key={t} className="pill">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
