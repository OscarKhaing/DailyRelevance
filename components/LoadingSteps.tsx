import type { Profile } from "./ProfileSummary";

export type Step = "profile" | "searching" | "synthesizing" | "done";

const STEPS: { id: Step; label: string; hint: string }[] = [
  { id: "profile", label: "Reading your bio", hint: "Extracting role, industry, and focus areas" },
  { id: "searching", label: "Searching the web", hint: "Running targeted queries across your topics" },
  { id: "synthesizing", label: "Curating your briefing", hint: "Ranking and summarizing the 5 most relevant stories" },
];

function order(step: Step): number {
  return step === "profile" ? 0 : step === "searching" ? 1 : step === "synthesizing" ? 2 : 3;
}

export function LoadingSteps({
  current,
  profile,
}: {
  current: Step;
  profile: Profile | null;
}) {
  const cur = order(current);
  return (
    <div className="fade-up space-y-3">
      {STEPS.map((s, i) => {
        const state = i < cur ? "done" : i === cur ? "active" : "pending";
        return (
          <div
            key={s.id}
            className={`glass flex items-start gap-4 rounded-2xl p-4 transition-opacity ${
              state === "pending" ? "opacity-40" : "opacity-100"
            }`}
          >
            <div className="relative mt-1 h-6 w-6 flex-shrink-0">
              {state === "done" ? (
                <div className="step-dot-done flex h-6 w-6 items-center justify-center rounded-full text-white">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
                    <path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : state === "active" ? (
                <>
                  <span className="step-dot-active-halo absolute inset-0 rounded-full pulse-dot" />
                  <span className="step-dot-active-core absolute inset-1.5 rounded-full" />
                </>
              ) : (
                <span className="step-dot-idle absolute inset-1.5 rounded-full" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="font-medium">{s.label}</div>
                {state === "active" && (
                  <div className="flex gap-1">
                    <span className="h-1 w-1 step-dot-pulse rounded-full pulse-dot" />
                    <span className="h-1 w-1 step-dot-pulse rounded-full pulse-dot" style={{ animationDelay: "200ms" }} />
                    <span className="h-1 w-1 step-dot-pulse rounded-full pulse-dot" style={{ animationDelay: "400ms" }} />
                  </div>
                )}
              </div>
              <div className="text-sm text-[color:var(--color-muted)]">{s.hint}</div>

              {s.id === "profile" && state === "done" && profile && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="pill">{profile.role}</span>
                  <span className="pill pill-soft">{profile.industry}</span>
                </div>
              )}
              {s.id === "searching" && profile && (state === "active" || state === "done") && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.topics.slice(0, 4).map((t, idx) => (
                    <span
                      key={t}
                      className={`pill ${state === "active" ? "shimmer" : ""}`}
                      style={state === "active" ? { animationDelay: `${idx * 120}ms` } : undefined}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
