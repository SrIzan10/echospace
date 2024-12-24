import prisma from './lib/db';

export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { default: Redis } = await import('ioredis');
      const redis = new Redis(process.env.REDIS_URL!);
      
      console.log('Uploading all ratelimits to redis...');
      const ratelimits = (await prisma.project.findMany()).map((pr) => {
        return { req: pr.rateLimitReq, time: pr.rateLimitTime, project: pr.id };
      });

      const multi = redis.multi();
      multi.del('ratelimit:*');
      ratelimits.forEach((rl) => {
        multi.set(`ratelimit:${rl.project}`, `${rl.req}:${rl.time}`);
      });
      await multi.exec();
      console.log('All ratelimits uploaded to redis!');
    }
  } catch {}
}
