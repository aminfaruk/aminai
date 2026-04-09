import { getStore } from "@netlify/blobs";

export default async function handler(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session");
  const since = parseInt(url.searchParams.get("since") || "0", 10);

  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing session" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const store = getStore("messages");
  const convoKey = `convo:${sessionId}`;

  let convo = [];
  try {
    const raw = await store.get(convoKey);
    if (raw) convo = JSON.parse(raw);
  } catch {}

  // Return only Amin's replies newer than `since` timestamp
  const newReplies = convo.filter(m => m.from === "amin" && m.ts > since);

  return new Response(JSON.stringify({ replies: newReplies }), {
    headers: { "Content-Type": "application/json" },
  });
}
