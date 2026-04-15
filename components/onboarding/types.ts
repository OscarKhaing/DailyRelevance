export type ProfileDraft = {
  lifeStage: string;
  gender: string;
  locationOrSchool: string;
  industry: string[]; // multi-select up to 2
  personalities: string[];
  bio: string; // freeform "anything else?"
  intent: string[];
  interests: string[];
};

export const emptyDraft: ProfileDraft = {
  lifeStage: "",
  gender: "",
  locationOrSchool: "",
  industry: [],
  personalities: [],
  bio: "",
  intent: [],
  interests: [],
};

export const STORAGE_KEY = "personafeed_profile";

// ─── option catalogs ──────────────────────────────────────────────

export const LIFE_STAGES = [
  "Student",
  "Professional",
  "Researcher",
  "Educator",
  "Entrepreneur",
];

export const GENDERS = ["Man", "Woman", "Non-binary", "Prefer not to say"];

export const QUICK_LOCATIONS = [
  "MIT",
  "Stanford",
  "UC Berkeley",
  "London",
  "Singapore",
  "New York",
  "Remote",
];

export const INDUSTRIES = [
  "Finance & Fintech",
  "Healthcare & Biotech",
  "Climate & Energy",
  "Technology & AI",
  "Media & Entertainment",
  "Education",
  "Government & Policy",
  "Retail & E-commerce",
  "Manufacturing",
  "Real Estate",
  "Legal",
  "Sports & Fitness",
];

export const PERSONALITIES = [
  "Athletic",
  "Creative",
  "Analytical",
  "Social",
  "Introverted",
  "Bookworm",
  "Trend-setter",
  "Spiritual",
  "Religious",
  "Political",
  "Entrepreneurial",
  "Artistic",
  "Competitive",
  "Adventurous",
  "Tech-savvy",
];

export const INTENTS = [
  "Stay informed on my industry",
  "Do research or due diligence",
  "Discover trends before they go mainstream",
  "Learn something new every day",
  "Track competitors or companies",
  "Keep up with world news",
];

export const INTEREST_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Business & Markets",
    items: ["Stocks & Investing", "Startups", "Crypto", "Real Estate", "M&A"],
  },
  {
    label: "World",
    items: ["Politics", "International Affairs", "Climate Change", "Policy & Regulation"],
  },
  {
    label: "Tech",
    items: ["AI & Machine Learning", "Cybersecurity", "Space", "Consumer Tech"],
  },
  {
    label: "Culture",
    items: ["Sports", "Books", "Film & TV", "Music", "Food & Travel", "Fashion"],
  },
  {
    label: "Science",
    items: ["Biology", "Physics", "Medicine", "Environment"],
  },
];

// ─── bio assembly ─────────────────────────────────────────────────

export function assembleBio(d: ProfileDraft): string {
  const parts: string[] = [];
  const stage = d.lifeStage ? d.lifeStage.toLowerCase() : "";
  if (stage) parts.push(`I am a ${stage}`);
  if (d.industry.length)
    parts.push(
      `${stage ? "working" : "focused on"} in ${d.industry.join(" and ")}`,
    );
  if (d.locationOrSchool)
    parts.push(`based in/at ${d.locationOrSchool}`);
  if (d.personalities.length)
    parts.push(`I am ${d.personalities.slice(0, 5).join(", ").toLowerCase()}`);
  if (d.interests.length)
    parts.push(`I follow ${d.interests.slice(0, 8).join(", ")}`);
  if (d.intent.length)
    parts.push(`I use PersonaFeed to ${d.intent[0].toLowerCase()}`);
  if (d.bio.trim()) parts.push(d.bio.trim());
  return parts.join(". ") + (parts.length ? "." : "");
}

export function hasMeaningfulData(d: ProfileDraft): boolean {
  return (
    Boolean(d.lifeStage) ||
    d.industry.length > 0 ||
    d.personalities.length > 0 ||
    d.interests.length > 0 ||
    d.intent.length > 0 ||
    d.bio.trim().length > 0 ||
    d.locationOrSchool.trim().length > 0
  );
}

export function initialsFor(d: ProfileDraft): string {
  const a = d.lifeStage?.[0] ?? "";
  const b = d.industry[0]?.[0] ?? d.locationOrSchool?.[0] ?? "";
  return (a + b).toUpperCase() || "PF";
}
