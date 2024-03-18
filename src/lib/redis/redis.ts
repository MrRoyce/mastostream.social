import { createClient } from 'redis';
import { VITE_REDIS_HOST, VITE_REDIS_PASSWORD, VITE_REDIS_PORT } from '$env/static/private'

export const redis = createClient({
  password: VITE_REDIS_PASSWORD,
  socket: {
    host: VITE_REDIS_HOST,
    port: VITE_REDIS_PORT
  }
});
