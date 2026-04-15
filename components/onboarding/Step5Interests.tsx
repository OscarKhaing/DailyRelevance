import { Chip } from "./Chip";
import { INTEREST_GROUPS, type ProfileDraft } from "./types";

export function Step5Interests({
  draft,
  onChange,
}: {
  draft: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
}) {
  function toggle(s: string) {
    const has = draft.interests.includes(s);
    onChange({
      interests: has
        ? draft.interests.filter((x) => x !== s)
        : [...draft.interests, s],
    });
  }

  return (
    <div className="space-y-7">
      {INTEREST_GROUPS.map((g) => (
        <div key={g.label}>
          <div className="mb-2 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            {g.label}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((s) => (
              <Chip
                key={s}
                label={s}
                size="sm"
                selected={draft.interests.includes(s)}
                onToggle={() => toggle(s)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="pt-2 text-xs text-[color:var(--color-muted)]">
        {draft.interests.length} selected
      </div>
    </div>
  );
}
