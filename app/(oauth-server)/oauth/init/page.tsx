import { prisma, redis } from "@/clients";
import { cookies } from "next/headers";
import { createToken } from "../token/utils";
import type { ServerPage } from "@/types/page";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";
import { createHash } from "../utils/hash";

const Page = ({ searchParams }: ServerPage) => {
  const Post = async (data: FormData) => {
    "use server";
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    const checkExisting = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (checkExisting !== null) {
      console.log("user already exists!");
      return;
    }
    const userKey = await createHash(password);
    const user = await prisma.user.create({
      data: {
        email,
        key: userKey,
      },
    });

    const token = createToken(user.id, ["user"], ["email", "name"]);
    cookies().set("access_token", token, {
      path: "/",
      maxAge: 86400,
      sameSite: "strict",
    });
    await redis.json.set(`user-session:${user.id}`, ".", {
      email: user.email,
      id: user.id,
      name: user.name,
    });

    redirect(
      `${env.APP_URL}/oauth/authorize?callback_url=${searchParams.callback_url}&state=${searchParams.state}`
    );
  };

  return (
    <>
      <form action={Post}>
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default Page;
