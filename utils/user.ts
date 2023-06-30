import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { env } from "@/env.mjs";
import { type JwtPayload, default as jwt } from "jsonwebtoken";
import { redis } from "@/clients";

const verifyToken = (token: string): JwtPayload | string | null => {
  try {
    return jwt.verify(token, env.AUTH_KEY);
  } catch (E) {
    return null;
  }
};

export const getUser = async (
  store: ReadonlyRequestCookies
): Promise<null | { email: string; id: string; name: null | string }> => {
  const token = store.get("access_token");
  if (!token) {
    return null;
  }
  const verifiedContent = verifyToken(token.value);

  if (!verifiedContent) {
    return null;
  }
  const user = await redis.json.get(`user-session:${verifiedContent.sub}`);

  if (!user) {
    return null;
  }

  return user as { email: string; id: string; name: null | string };
};
