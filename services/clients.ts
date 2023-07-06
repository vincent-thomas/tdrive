import { env } from "env.mjs";
import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

interface CustomNodeJsGlobal {
  prisma: PrismaClient;
}
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;
const s3 = new S3Client({
  credentials: {
    accessKeyId: env.S3_FILES_KEY,
    secretAccessKey: env.S3_FILES_SECRET,
  },
});

const redis = createClient({
  url: env.REDIS_URL,
}).on("error", (err) => console.log("Redis Client Error", err));
redis.connect();

export const c = {
  s3,
  redis,
  prisma,
};
