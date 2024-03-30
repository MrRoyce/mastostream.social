import { default as Redis } from "ioredis"
import { VITE_REDIS_HOST, VITE_REDIS_PASSWORD, VITE_REDIS_PORT } from '$env/static/private'

function getRedis() {
  let response
  try {
    response = new Redis(`redis://:${VITE_REDIS_PASSWORD}@${VITE_REDIS_HOST}:${VITE_REDIS_PORT}`);
  } catch (error) {
    console.error('Error connecting to redis', error)
  }
  return response
}

export const redis = getRedis()


// export const newRedis = new Redis({
//   port: 6379, // Redis port
//   host: "127.0.0.1", // Redis host
//   username: "default", // needs Redis >= 6
//   password: "my-top-secret",
//   db: 0, // Defaults to 0
// });

// export const redisxx = new Redis(`redis://:${VITE_REDIS_PASSWORD}@${VITE_REDIS_HOST}:${VITE_REDIS_PORT}`);

// export const redisx = createClient({
//   password: VITE_REDIS_PASSWORD,
//   socket: {
//     host: VITE_REDIS_HOST,
//     port: VITE_REDIS_PORT
//   }
// });
