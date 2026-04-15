import { assembleBio, initialsFor, type ProfileDraft } from "./types";

export function Step6Preview({ draft }: { draft: ProfileDraft }) {
  const initials = initialsFor(draft);
  const roleLine = [draft.lifeStage, draft.industry.join(" · ")]
    .filter(Boolean)
    .join(" · ");
  const bio = assembleBio(draft);

  return (
    <div className="space-y-5">
      <div className="glass rounded-2xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="avatar-gradient flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-lg shadow-lg shadow-fuchsia-500/30">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base md:text-lg font-semibold tracking-tight">
              {roleLine || "Your profile"}
            </div>
            {draft.locationOrSchool && (
              <div className="mt-0.5 text-sm text-[color:var(--color-muted)]">
                📍 {draft.locationOrSchool}
              </div>
            )}
          </div>
        </div>

        {draft.personalities.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
              Traits
            </div>
            <div className="flex flex-wrap gap-1.5">
              {draft.personalities.map((p) => (
                <span key={p} className="pill">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {draft.interests.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
              Interests
            </div>
            <div className="flex flex-wrap gap-1.5">
              {draft.interests.map((p) => (
                <span key={p} className="pill pill-soft">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {draft.intent.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
              Here for
            </div>
            <div className="flex flex-wrap gap-1.5">
              {draft.intent.map((p) => (
                <span key={p} className="pill">
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          We'll search the web using this
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm italic leading-relaxed text-[color:var(--color-ink)]/85">
          “{bio || "Add at least a few tags so we can personalize your feed."}”
        </div>
      </div>
    </div>
  );
}
