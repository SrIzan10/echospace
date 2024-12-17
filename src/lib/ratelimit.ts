import redis from "./db/redis";

// TODO: the ratelimit function doesn't look right with the times. may revisit.
export default async function ratelimit(ip: string, projectId: string, limit: number, duration: number) {
  const key = `ratelimit:${ip}:${projectId}`;
  
  // use multi to save on requests
  const multi = redis.multi();
  multi.exists(key);
  multi.incr(key);
  
  const result = await multi.exec();
  if (!result) {
    throw new Error("Failed to execute multi command");
  }

  const exists = result[0][1] as number;
  const current = result[1][1] as number;

  if (exists === 0) {
    await redis.expire(key, Math.floor(duration));
  }

  const ttl = await redis.ttl(key);

  return {
    exceeded: current > limit,
    remaining: Math.max(0, limit - current),
    reset: ttl,
  }
}