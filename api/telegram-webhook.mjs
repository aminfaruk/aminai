import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('OK', { status: 200 });
  }

  const update = await req.json();
  const message = update.message;
  if (!message || !message.reply_to_message) {
    return new Response('OK', { status: 200 });
  }

  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  if (String(message.chat.id) !== String(CHAT_ID)) {
    return new Response('OK', { status: 200 });
  }

  const replyText = message.text;
  if (!replyText) {
    return new Response('OK', { status: 200 });
  }

  const redis = Redis.fromEnv();
  const originalMsgId = String(message.reply_to_message.message_id);

  // Look up session from Redis
  let sessionId = await redis.get(`tg:${originalMsgId}`);

  // Fallback: extract session ID from original message text
  if (!sessionId) {
    const originalText = message.reply_to_message.text || '';
    const match = originalText.match(/^\[([^\]]+)\]/);
    if (match) sessionId = match[1];
  }

  if (!sessionId) {
    return new Response('OK', { status: 200 });
  }

  // Append reply to conversation
  const convoKey = `convo:${sessionId}`;
  const convo = (await redis.get(convoKey)) || [];
  convo.push({ from: 'amin', text: replyText, ts: Date.now() });
  await redis.set(convoKey, convo, { ex: 86400 });

  return new Response('OK', { status: 200 });
}
