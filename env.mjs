import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    AUTH_KEY: z.string(),
    S3_FILES_ACCESS_KEY: z.string(),
    S3_FILES_ACCESS_SECRET: z.string(),
    S3_FILES_BUCKET: z.string(),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    APP_URL: z.string(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_KEY: process.env.AUTH_KEY,
    APP_URL: `${process.env.NODE_ENV === "development" ? "http" : "https"}://${
      process.env.VERCEL_URL
    }`,
    NEXT_PUBLIC_APP_URL: `${
      process.env.NODE_ENV === "development" ? "http" : "https"
    }://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
    S3_FILES_ACCESS_KEY: process.env.S3_UPLOAD_KEY,
    S3_FILES_ACCESS_SECRET: process.env.S3_UPLOAD_SECRET,
    S3_FILES_BUCKET: process.env.S3_UPLOAD_BUCKET,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
