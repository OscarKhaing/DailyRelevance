import { Chip } from "./Chip";
import { PERSONALITIES, type ProfileDraft } from "./types";

const MAX = 5;

export function Step3Personality({
  draft,
  onChange,
}: {
  draft: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
}) {
  function toggle(s: string) {
    const has = draft.personalities.includes(s);
    if (has) {
      onChange({ personalities: draft.personalities.filter((x) => x !== s) });
    } else if (draft.personalities.length < MAX) {
      onChange({ personalities: [...draft.personalities, s] });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            Traits
          </div>
          <div className="text-xs text-[color:var(--color-muted)]">
            {draft.personalities.length}/{MAX} selected
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PERSONALITIES.map((s) => {
            const selected = draft.personalities.includes(s);
            const atCap = !selected && draft.personalities.length >= MAX;
            return (
              <Chip
                key={s}
                label={s}
                size="md"
                selected={selected}
                disabled={atCap}
                onToggle={() => toggle(s)}
              />
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          Anything else? <span className="text-white/30">— optional</span>
        </div>
        <div className="input-row">
          <input
            type="text"
            value={draft.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="e.g. obsessed with Formula 1"
            className="input-bare"
          />
        </div>
      </div>
    </div>
  );
}
