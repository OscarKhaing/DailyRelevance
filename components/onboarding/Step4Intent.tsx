import { CardChip } from "./Chip";
import { INTENTS, type ProfileDraft } from "./types";

export function Step4Intent({
  draft,
  onChange,
}: {
  draft: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
}) {
  function toggle(s: string) {
    const has = draft.intent.includes(s);
    onChange({
      intent: has
        ? draft.intent.filter((x) => x !== s)
        : [...draft.intent, s],
    });
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {INTENTS.map((s) => (
        <CardChip
          key={s}
          label={s}
          selected={draft.intent.includes(s)}
          onToggle={() => toggle(s)}
        />
      ))}
    </div>
  );
}
