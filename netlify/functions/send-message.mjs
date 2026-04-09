import { getStore } from "@netlify/blobs";

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { sessionId, text } = await req.json();
  if (!sessionId || !text) {
    return new Response(JSON.stringify({ error: "Missing sessionId or text" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Send to Telegram with session ID embedded so we can match replies
  const telegramText = `[${sessionId}]\n\n${text}`;

  const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: telegramText,
      parse_mode: "HTML",
    }),
  });

  const tgData = await tgRes.json();
  if (!tgData.ok) {
    return new Response(JSON.stringify({ error: "Failed to send to Telegram" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Store the mapping: telegram message ID -> session ID
  const store = getStore("messages");
  const msgId = String(tgData.result.message_id);

  await store.set(`tg:${msgId}`, JSON.stringify({ sessionId }));

  // Store conversation entry (user message)
  const convoKey = `convo:${sessionId}`;
  let convo = [];
  try {
    const existing = await store.get(convoKey);
    if (existing) convo = JSON.parse(existing);
  } catch {}
  convo.push({ from: "user", text, ts: Date.now() });
  await store.set(convoKey, JSON.stringify(convo));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
