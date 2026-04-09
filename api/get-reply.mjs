import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('session');
  const since = parseInt(url.searchParams.get('since') || '0', 10);

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'Missing session' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const redis = Redis.fromEnv();
  const convoKey = `convo:${sessionId}`;
  const convo = (await redis.get(convoKey)) || [];

  const newReplies = convo.filter(m => m.from === 'amin' && m.ts > since);

  return new Response(JSON.stringify({ replies: newReplies }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
