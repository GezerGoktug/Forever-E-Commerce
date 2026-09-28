import redisClient from "../config/redis";

const RedisClient = {
  set: (key: string, value: string, ttl: number = 180) => {
    return redisClient.setEx(key, ttl, value);
  },

  get: (key: string) => {
    return redisClient.get(key);
  },

  update: (key: string, value: string) => {
    return redisClient.set(key, value, { KEEPTTL: true });
  },

  del: (key: string) => {
    return redisClient.del(key);
  },

  delByPrefix: async (prefix: string) => {
    let cursor = '0';
    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: `${prefix}*`,
        COUNT: 100
      });
      cursor = reply.cursor;
      const keys = reply.keys;
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } while (cursor !== '0');
  }
};

export default RedisClient;
