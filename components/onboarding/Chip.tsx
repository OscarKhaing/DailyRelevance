import type { ReactNode } from "react";

type ChipSize = "sm" | "md" | "lg";

export function Chip({
  label,
  selected,
  onToggle,
  size = "md",
  disabled = false,
  leading,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  size?: ChipSize;
  disabled?: boolean;
  leading?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      data-selected={selected}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      className={`chip chip-${size}`}
    >
      {leading}
      {label}
    </button>
  );
}

export function CardChip({
  label,
  selected,
  onToggle,
  description,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-selected={selected}
      aria-pressed={selected}
      className="chip-card"
    >
      <span className="chip-card-check">
        {selected && (
          <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none">
            <path
              d="M5 10.5l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="flex-1">
        <span className="block font-medium text-white">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-[color:var(--color-muted)]">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
