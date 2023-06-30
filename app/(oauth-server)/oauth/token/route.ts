import { type NextRequest } from "next/server";
import { createToken, createTokenHeaders } from "./utils";
import { prisma, redis } from "@/clients";
import { AResponse } from "@/utils/io";

export const POST = async (req: NextRequest) => {
  const { code: codeFromBody } = (await req.json()) as { code: string };
  const code = Buffer.from(codeFromBody, "base64").toString("utf8");
  const [userId, authCode] = code.split(":") as [string, string];
  const dbCode = await redis.get(`user:${userId}:auth_code`);
  if (dbCode === authCode) {
    const access_token = createToken(userId, ["user"], ["email"]);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        key: false,
        name: true,
        email: true,
        id: true,
      },
    });

    // Save user session / Cache
    await redis.json.set(`user-session:${userId}`, ".", user);
    await redis.sendCommand(["EXPIRE", `user-session:${userId}`, "86400"]);

    // Delete auth code
    await redis.sendCommand(["EXPIRE", `user:${userId}:auth_code`, "1"]);
    return AResponse({ access_token }, null, {
      headers: createTokenHeaders(access_token),
    });
  }

  return AResponse(null, { message: "Code is invalid" }, { status: 401 });
};
