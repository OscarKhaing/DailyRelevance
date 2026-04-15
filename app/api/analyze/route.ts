import OpenAI from "openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROFILE_SYSTEM = `You extract a compact professional profile from a bio.
Respond with ONLY valid JSON (no prose, no markdown fences) matching:
{
  "role": string,
  "industry": string,
  "focus": string,           // one sentence, second-person ("You focus on...")
  "topics": string[]         // 3-5 concrete, searchable topics (not generic)
}`;

function newsSystem(today: string): string {
  return `You are a personalized news briefing curator with live web search.

TODAY'S DATE: ${today}

CRITICAL RULES:
1. You MUST call the web_search tool before answering. Do not rely on prior knowledge.
2. Run 3-5 targeted web_search queries across the user's topics. Include the current year (and "this week" / "latest" / "${today.slice(0, 7)}") in your queries to bias results toward recency.
3. Only include articles published within the LAST 30 DAYS of TODAY'S DATE. If you cannot find 5 fresh articles, return fewer — never substitute older articles from memory.
4. The url for every article MUST come directly from a web_search result in this session — never invent or reconstruct URLs.

After searching, respond with ONLY valid JSON (no prose, no code fences) in this exact shape:
{
  "articles": [
    {
      "title": "string",
      "source": "string",
      "url": "string (real URL from search)",
      "date": "string (e.g. 'Apr 12, 2026' — must be within the last 30 days)",
      "summary": "string (exactly 2 sentences)",
      "relevance": "string (1 sentence: why THIS person cares — name their role/focus)",
      "tags": ["1-3 short Title Case labels"]
    }
  ]
}
Rank by relevance. Return up to 5 articles, all from the last 30 days.`;
}

function extractJSON(s: string): string {
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fence ? fence[1] : s;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) return body;
  return body.slice(start, end + 1);
}

type Annotation = { type?: string; url?: string; title?: string };

export async function POST(req: Request) {
  const { bio } = (await req.json()) as { bio?: string };
  if (!bio || bio.trim().length < 20) {
    return new Response(JSON.stringify({ error: "Bio too short" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      try {
        send("status", { step: "profile" });

        // Step 1 — profile extraction (Chat Completions JSON mode)
        const profileRes = await client.chat.completions.create({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 400,
          messages: [
            { role: "system", content: PROFILE_SYSTEM },
            { role: "user", content: bio },
          ],
        });

        const profile = JSON.parse(
          profileRes.choices[0]?.message?.content ?? "{}",
        ) as {
          role: string;
          industry: string;
          focus: string;
          topics: string[];
        };

        send("profile", profile);
        send("status", { step: "searching" });

        // Step 2 — Responses API with built-in web_search tool
        const compactInput = [
          `Role: ${profile.role}`,
          `Industry: ${profile.industry}`,
          `Focus: ${profile.focus}`,
          `Topics: ${profile.topics.join(", ")}`,
          ``,
          `Search the web and return the 5-article JSON briefing described in the instructions.`,
        ].join("\n");

        const today = new Date().toISOString().slice(0, 10);

        const newsRes = await client.responses.create({
          model: "gpt-4o-mini",
          instructions: newsSystem(today),
          input: `Today is ${today}.\n\n${compactInput}`,
          tools: [
            {
              type: "web_search_preview",
              search_context_size: "high",
            },
          ],
          tool_choice: { type: "web_search_preview" },
          temperature: 0.4,
          max_output_tokens: 2000,
        });

        send("status", { step: "synthesizing" });

        const newsText = newsRes.output_text ?? "";
        const parsed = JSON.parse(extractJSON(newsText)) as {
          articles: Array<{
            title: string;
            source: string;
            url: string;
            date?: string;
            summary: string;
            relevance: string;
            tags: string[];
          }>;
        };

        // Backfill any missing URLs from the response's citation annotations
        type OutputItem = {
          type?: string;
          content?: Array<{ type?: string; annotations?: Annotation[] }>;
        };
        const citations: { url: string; title?: string }[] = [];
        for (const o of (newsRes.output ?? []) as unknown as OutputItem[]) {
          if (o.type !== "message") continue;
          for (const c of o.content ?? []) {
            for (const a of c.annotations ?? []) {
              if (a.url) citations.push({ url: a.url, title: a.title });
            }
          }
        }
        parsed.articles = parsed.articles.map((a, i) => {
          if (a.url?.startsWith("http")) return a;
          const fb = citations[i];
          if (!fb) return a;
          return { ...a, url: fb.url, source: a.source || fb.title || "" };
        });

        send("articles", parsed);
        send("done", {});
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error";
        send("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
