import { Chip } from "./Chip";
import { INDUSTRIES, QUICK_LOCATIONS, type ProfileDraft } from "./types";

const MAX_INDUSTRY = 2;

export function Step2Context({
  draft,
  onChange,
}: {
  draft: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
}) {
  function toggleIndustry(s: string) {
    const has = draft.industry.includes(s);
    if (has) {
      onChange({ industry: draft.industry.filter((x) => x !== s) });
    } else if (draft.industry.length < MAX_INDUSTRY) {
      onChange({ industry: [...draft.industry, s] });
    }
  }

  return (
    <div className="space-y-9">
      <div>
        <div className="mb-3 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          Location or school
        </div>
        <div className="input-row">
          <input
            type="text"
            value={draft.locationOrSchool}
            onChange={(e) => onChange({ locationOrSchool: e.target.value })}
            placeholder="City, country or school name"
            className="input-bare"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {QUICK_LOCATIONS.map((l) => (
            <Chip
              key={l}
              label={l}
              size="sm"
              selected={draft.locationOrSchool === l}
              onToggle={() =>
                onChange({
                  locationOrSchool: draft.locationOrSchool === l ? "" : l,
                })
              }
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            Your field
          </div>
          <div className="text-xs text-[color:var(--color-muted)]">
            {draft.industry.length}/{MAX_INDUSTRY} selected
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((s) => {
            const selected = draft.industry.includes(s);
            const atCap = !selected && draft.industry.length >= MAX_INDUSTRY;
            return (
              <Chip
                key={s}
                label={s}
                size="md"
                selected={selected}
                disabled={atCap}
                onToggle={() => toggleIndustry(s)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
