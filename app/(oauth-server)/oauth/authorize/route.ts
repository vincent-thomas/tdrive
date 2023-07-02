import { redis } from "@/clients";
import { randomUUID } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/user";
import { cookies } from "next/headers";
import { env } from "@/env.mjs";

export const GET = async (req: NextRequest) => {
  const callback = decodeURIComponent(
    req.nextUrl.searchParams.get("callback_url") as string
  );
  const state = decodeURIComponent(req.nextUrl.searchParams.get("state") || "");
  const user = await getUser(cookies());

  if (!user) {
    return NextResponse.redirect(
      `${env.APP_URL}/oauth/login?callback_url=${encodeURIComponent(
        callback
      )}&state=${state}`
    );
  }

  const code = randomUUID();
  await redis.set(`user:${user.id}:auth_code`, code);
  await redis.sendCommand(["EXPIRE", `user:${user.id}:auth_code`, String(30)]);
  const authCode = Buffer.from(`${user.id}:${code}`).toString("base64");
  return NextResponse.redirect(`${callback}?code=${authCode}&state=${state}`);
};
