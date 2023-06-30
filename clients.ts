import { env } from "@/env.mjs";
import { S3 } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

interface CustomNodeJsGlobal {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const redis = createClient({
  url: env.REDIS_URL,
}).on("error", (err) => console.log("Redis Client Error", err));
redis.connect();

export const s3 = new S3({
  region: "eu-north-1",
  apiVersion: "v4",
  credentials: {
    accessKeyId: env.S3_UPLOAD_ACCESS_KEY,
    secretAccessKey: env.S3_UPLOAD_SECRET,
  },
});
