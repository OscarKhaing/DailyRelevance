import { Chip } from "./Chip";
import { LIFE_STAGES, GENDERS, type ProfileDraft } from "./types";

export function Step1Identity({
  draft,
  onChange,
}: {
  draft: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          Life stage
        </div>
        <div className="flex flex-wrap gap-2">
          {LIFE_STAGES.map((s) => (
            <Chip
              key={s}
              label={s}
              size="lg"
              selected={draft.lifeStage === s}
              onToggle={() =>
                onChange({ lifeStage: draft.lifeStage === s ? "" : s })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          Gender <span className="text-white/30">— optional</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Chip
              key={g}
              label={g}
              size="md"
              selected={draft.gender === g}
              onToggle={() =>
                onChange({ gender: draft.gender === g ? "" : g })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
