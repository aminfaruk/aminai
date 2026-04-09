import { getStore } from "@netlify/blobs";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("OK", { status: 200 });
  }

  const update = await req.json();
  const message = update.message;
  if (!message || !message.reply_to_message) {
    // Not a reply — ignore
    return new Response("OK", { status: 200 });
  }

  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Only process replies from Amin's chat
  if (String(message.chat.id) !== String(CHAT_ID)) {
    return new Response("OK", { status: 200 });
  }

  const store = getStore("messages");
  const originalMsgId = String(message.reply_to_message.message_id);
  const replyText = message.text;

  if (!replyText) {
    return new Response("OK", { status: 200 });
  }

  // Look up which session this reply belongs to
  let mapping;
  try {
    const raw = await store.get(`tg:${originalMsgId}`);
    if (raw) mapping = JSON.parse(raw);
  } catch {}

  if (!mapping) {
    // Could also try extracting session ID from the original message text
    const originalText = message.reply_to_message.text || "";
    const match = originalText.match(/^\[([^\]]+)\]/);
    if (match) {
      mapping = { sessionId: match[1] };
    }
  }

  if (!mapping) {
    return new Response("OK", { status: 200 });
  }

  // Append Amin's reply to the conversation
  const convoKey = `convo:${mapping.sessionId}`;
  let convo = [];
  try {
    const existing = await store.get(convoKey);
    if (existing) convo = JSON.parse(existing);
  } catch {}
  convo.push({ from: "amin", text: replyText, ts: Date.now() });
  await store.set(convoKey, JSON.stringify(convo));

  return new Response("OK", { status: 200 });
}
