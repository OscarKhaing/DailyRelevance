"use client";

import { useState } from "react";
import {
  emptyDraft,
  hasMeaningfulData,
  type ProfileDraft,
} from "./types";
import { Step1Identity } from "./Step1Identity";
import { Step2Context } from "./Step2Context";
import { Step3Personality } from "./Step3Personality";
import { Step4Intent } from "./Step4Intent";
import { Step5Interests } from "./Step5Interests";
import { Step6Preview } from "./Step6Preview";

type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_META: {
  title: string;
  subtitle: string;
}[] = [
  {
    title: "Let's get to know you",
    subtitle: "Select everything that applies",
  },
  {
    title: "Your world",
    subtitle: "Where you are and the field you're in",
  },
  {
    title: "How would you describe yourself?",
    subtitle: "Pick up to 5 traits",
  },
  {
    title: "What brings you here?",
    subtitle: "Select all that apply",
  },
  {
    title: "What do you already follow?",
    subtitle: "We'll make sure these show up",
  },
  {
    title: "Here's your profile",
    subtitle: "This is what we'll use to find news for you",
  },
];

function canProceed(step: StepIndex, d: ProfileDraft): boolean {
  switch (step) {
    case 0:
      return Boolean(d.lifeStage);
    case 1:
      return d.industry.length > 0 || d.locationOrSchool.trim().length > 0;
    case 2:
      return d.personalities.length > 0 || d.bio.trim().length > 0;
    case 3:
      return d.intent.length > 0;
    case 4:
      return d.interests.length > 0;
    case 5:
      return hasMeaningfulData(d);
    default:
      return false;
  }
}

export function OnboardingShell({
  onComplete,
}: {
  onComplete: (draft: ProfileDraft) => void;
}) {
  const [step, setStep] = useState<StepIndex>(0);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [missingWarn, setMissingWarn] = useState(false);

  const meta = STEP_META[step];
  const progress = ((step + 1) / STEP_META.length) * 100;
  const proceed = canProceed(step, draft);

  function patch(p: Partial<ProfileDraft>) {
    setMissingWarn(false);
    setDraft((d) => ({ ...d, ...p }));
  }

  function next() {
    if (step < 5) setStep((s) => (s + 1) as StepIndex);
  }
  function back() {
    if (step > 0) setStep((s) => (s - 1) as StepIndex);
  }
  function skip() {
    if (step < 5) setStep((s) => (s + 1) as StepIndex);
  }

  function submit() {
    if (!hasMeaningfulData(draft)) {
      setMissingWarn(true);
      return;
    }
    onComplete(draft);
  }

  return (
    <section className="mt-8 md:mt-10">
      <div className="mb-6 md:mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-[color:var(--color-muted)]">
          <span className="font-mono uppercase tracking-[0.18em]">
            Step {step + 1} of {STEP_META.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={step} className="fade-up">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
          {meta.title.includes("profile") ? (
            <>
              Here's your <span className="gradient-text">profile</span>
            </>
          ) : (
            meta.title
          )}
        </h1>
        {meta.subtitle && (
          <p className="mt-2 text-sm md:text-base text-[color:var(--color-muted)]">
            {meta.subtitle}
          </p>
        )}

        <div className="mt-7 md:mt-8">
          {step === 0 && <Step1Identity draft={draft} onChange={patch} />}
          {step === 1 && <Step2Context draft={draft} onChange={patch} />}
          {step === 2 && <Step3Personality draft={draft} onChange={patch} />}
          {step === 3 && <Step4Intent draft={draft} onChange={patch} />}
          {step === 4 && <Step5Interests draft={draft} onChange={patch} />}
          {step === 5 && <Step6Preview draft={draft} />}
        </div>
      </div>

      {missingWarn && (
        <div className="mt-5 rounded-xl border border-rose-400/25 bg-rose-400/5 p-3 text-sm text-rose-200 fade-up">
          Add at least a few tags so we can personalize your feed.
        </div>
      )}

      <div className="sticky bottom-0 z-10 mt-8 -mx-5 border-t border-white/5 bg-[color:var(--color-bg)]/70 px-5 py-4 backdrop-blur md:-mx-0 md:rounded-xl md:border md:border-white/5 md:bg-white/[0.02] md:px-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="text-sm text-[color:var(--color-muted)] hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            {step < 5 && (
              <button
                type="button"
                onClick={skip}
                className="rounded-lg px-3 py-2 text-sm text-[color:var(--color-muted)] hover:text-white transition"
              >
                Skip
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={next}
                disabled={!proceed}
                className="btn-primary rounded-xl px-5 py-2.5 text-sm"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="btn-primary rounded-xl px-5 py-2.5 text-sm"
              >
                Get my feed →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
