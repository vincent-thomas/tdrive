import { env } from "@/env.mjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTokens } from "./getTokens";
import { AResponse } from "@/utils/io";
import { redis } from "@/clients";

export const GET = async () => {
  const store = cookies();
  const { accessToken } = getTokens(store);
  try {
    const data = jwt.verify(accessToken, env.AUTH_KEY) as JwtPayload;
    const stringUser = await redis.json.get(
      `user-session:${data.sub as string}`
    );
    return AResponse(stringUser);
  } catch {
    return NextResponse.json({ verified: false });
  }
};
