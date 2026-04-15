"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileSummary, type Profile } from "@/components/ProfileSummary";
import { NewsCard, type Article } from "@/components/NewsCard";
import { LoadingSteps, type Step as LoadingStep } from "@/components/LoadingSteps";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import {
  assembleBio,
  STORAGE_KEY,
  type ProfileDraft,
} from "@/components/onboarding/types";

type Stage = "onboarding" | "loading" | "results" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("onboarding");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [step, setStep] = useState<LoadingStep>("profile");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // restore saved profile on first mount
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as ProfileDraft;
        void run(assembleBio(draft));
      }
    } catch {
      // ignore malformed data
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(bio: string) {
    setStage("loading");
    setStep("profile");
    setProfile(null);
    setArticles([]);
    setError(null);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) throw new Error(`Request failed (${res.status})`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const chunks = buf.split("\n\n");
        buf = chunks.pop() ?? "";
        for (const chunk of chunks) {
          const lines = chunk.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event: "));
          const dataLine = lines.find((l) => l.startsWith("data: "));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(7).trim();
          const data = JSON.parse(dataLine.slice(6));
          if (event === "status") setStep(data.step as LoadingStep);
          else if (event === "profile") setProfile(data as Profile);
          else if (event === "articles") setArticles((data.articles ?? []) as Article[]);
          else if (event === "error") throw new Error(data.message ?? "Error");
          else if (event === "done") {
            setStep("done");
            setStage("results");
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError((e as Error).message);
      setStage("error");
    }
  }

  function handleOnboardComplete(draft: ProfileDraft) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // storage may be blocked; continue anyway
    }
    void run(assembleBio(draft));
  }

  function resetProfile() {
    abortRef.current?.abort();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setProfile(null);
    setArticles([]);
    setError(null);
    setStage("onboarding");
  }

  function retry() {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const draft = JSON.parse(raw) as ProfileDraft;
        void run(assembleBio(draft));
        return;
      } catch {
        /* fall through */
      }
    }
    resetProfile();
  }

  return (
    <main className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-8 md:pt-12">
      <Header onReset={mounted && stage !== "onboarding" ? resetProfile : undefined} />

      {stage === "onboarding" && (
        <OnboardingShell onComplete={handleOnboardComplete} />
      )}

      {stage === "loading" && (
        <section className="mt-10 md:mt-14 space-y-5">
          <div className="fade-up">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Building your <span className="gradient-text">briefing…</span>
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              This usually takes 10–25 seconds.
            </p>
          </div>
          <LoadingSteps current={step} profile={profile} />
        </section>
      )}

      {stage === "results" && profile && (
        <section className="mt-8 md:mt-12 space-y-6">
          <ProfileSummary profile={profile} />

          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">
              Today's briefing
              <span className="ml-2 text-sm font-normal text-[color:var(--color-muted)]">
                {articles.length} stor{articles.length === 1 ? "y" : "ies"}
              </span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={retry}
                className="glass glass-hover rounded-lg px-3 py-1.5 text-xs"
                title="Refresh with the same profile"
              >
                ↻ Refresh
              </button>
              <button
                onClick={resetProfile}
                className="glass glass-hover rounded-lg px-3 py-1.5 text-xs"
              >
                ✎ Edit profile
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((a, i) => (
              <NewsCard key={a.url + i} article={a} index={i} />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center text-[color:var(--color-muted)]">
              No articles returned. Try editing your profile for more specific topics.
            </div>
          )}
        </section>
      )}

      {stage === "error" && (
        <section className="mt-16 fade-up">
          <div className="glass rounded-2xl p-6">
            <div className="text-sm uppercase tracking-[0.18em] text-rose-300">
              Something broke
            </div>
            <p className="mt-2 text-[color:var(--color-ink)]/90">{error}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={retry}
                className="btn-primary rounded-xl px-4 py-2 text-sm"
              >
                Try again
              </button>
              <button
                onClick={resetProfile}
                className="glass glass-hover rounded-xl px-4 py-2 text-sm"
              >
                Start over
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Header({ onReset }: { onReset?: () => void }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-500 shadow-lg shadow-fuchsia-500/30" />
        <span className="text-base font-semibold tracking-tight">
          PersonaFeed
        </span>
      </div>
      <div className="flex items-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            title="Reset profile"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[color:var(--color-muted)] hover:border-fuchsia-400/40 hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M12 5V2M5.64 7.05l-2.12-2.12M5 12H2m3.64 4.95l-2.12 2.12M12 22v-3m4.95-1.05l2.12 2.12M22 12h-3m-1.05-4.95l2.12-2.12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        )}
        <a
          href="https://openai.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[color:var(--color-muted)] hover:text-white transition"
        >
          powered by OpenAI
        </a>
      </div>
    </header>
  );
}
