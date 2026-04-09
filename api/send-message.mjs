import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { sessionId, text } = await req.json();
  if (!sessionId || !text) {
    return new Response(JSON.stringify({ error: 'Missing sessionId or text' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Send to Telegram with session ID so we can match replies
  const telegramText = `[${sessionId}]\n\n${text}`;

  const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: telegramText,
    }),
  });

  const tgData = await tgRes.json();
  if (!tgData.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send to Telegram' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Store telegram msg ID -> session mapping in Redis
  const redis = Redis.fromEnv();
  const msgId = String(tgData.result.message_id);
  await redis.set(`tg:${msgId}`, sessionId, { ex: 86400 }); // expires in 24h

  // Store user message in conversation
  const convoKey = `convo:${sessionId}`;
  const convo = (await redis.get(convoKey)) || [];
  convo.push({ from: 'user', text, ts: Date.now() });
  await redis.set(convoKey, convo, { ex: 86400 });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
