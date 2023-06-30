"use server";
import { prisma } from "@/clients";
import { createHash } from "../utils/hash";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";

export async function Post(data: FormData) {
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user !== null) {
    console.log("user already exists!");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      key: await createHash(password),
    },
  });

  // const state = crypto.randomUUID();
  // sessionStorage.setItem("state", state);
  redirect(
    `${
      env.APP_URL
    }/oauth/authorize?email=${email}&password=${password}&callback_url=${encodeURI(
      `${env.APP_URL}/callback`
    )}`
  );
}
