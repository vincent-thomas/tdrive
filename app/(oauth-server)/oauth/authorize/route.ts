import { AResponse } from "@/utils/io";
import { prisma, redis } from "@/clients";
import { randomUUID } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import { verifyHash } from "../utils/hash";

export const GET = async (req: NextRequest) => {
  const email = req.nextUrl.searchParams.get("email") as string;
  const password = req.nextUrl.searchParams.get("password") as string;
  const state = req.nextUrl.searchParams.get("state") as string;
  const callback = decodeURIComponent(
    req.nextUrl.searchParams.get("callback_url") as string
  );
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return AResponse(null, { message: "User not found" }, { status: 401 });
  }
  const isPasswordCorrect = await verifyHash(user?.key, password);
  if (!isPasswordCorrect)
    return AResponse(
      null,
      { message: "User credentials is not correct" },
      { status: 401 }
    );

  const code = randomUUID();
  await redis.set(`user:${user.id}:auth_code`, code);
  await redis.sendCommand(["EXPIRE", `user:${user.id}:auth_code`, String(30)]);
  const authCode = Buffer.from(`${user.id}:${code}`).toString("base64");
  return NextResponse.redirect(`${callback}?code=${authCode}&state=${state}`);
};
