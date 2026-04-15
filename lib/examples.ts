export type Example = {
  label: string;
  emoji: string;
  bio: string;
};

export const EXAMPLES: Example[] = [
  {
    label: "Fintech PM",
    emoji: "💳",
    bio: "Senior PM at a B2B payments startup. I work on cross-border payouts, FX, and compliance tooling for SMBs in LATAM and SEA. Care a lot about stablecoin rails, ISO 20022 migration, and how regulators are framing embedded finance.",
  },
  {
    label: "Healthcare CTO",
    emoji: "🩺",
    bio: "CTO at an early-stage digital health startup focused on remote patient monitoring for cardiology. Lead a small engineering team building HIPAA-compliant pipelines on AWS. Interested in FDA SaMD pathways, wearables data, and AI-assisted diagnostics.",
  },
  {
    label: "AI Researcher",
    emoji: "🧠",
    bio: "ML researcher working on post-training methods for reasoning models — RL from verifier signals, inference-time compute, and long-horizon agent evaluation. Track releases from frontier labs and interpretability work closely.",
  },
];
