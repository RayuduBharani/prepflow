import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const isNew = await redis.sadd("unique_visitors_set", ip);
  if (isNew) {
    await redis.incr("unique_visitors_count");
  }
  const count = await redis.get<number>("unique_visitors_count");
  return Response.json({ count: count ?? 0 });
}
