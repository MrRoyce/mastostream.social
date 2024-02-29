import Redis from "ioredis"

const token = import.meta.env.VITE_IOREDIS_TOKEN
const domain = import.meta.env.VITE_IOREDIS_URL

const url = `rediss://default:${token}@${domain}:41735`
console.log('url', url)

const client = new Redis(url)

export const redis = () => client