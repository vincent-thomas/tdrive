import { prisma, redis } from "@/clients";
import { redirect } from "next/navigation";
import { verifyHash } from "../utils/hash";
import { cookies } from "next/headers";
import { createToken } from "../token/utils";
import { env } from "@/env.mjs";
import { ServerPage } from "@/types/page";
import { RedirectType } from "next/dist/client/components/redirect";

const Login = ({ searchParams }: ServerPage) => {
  async function submit(e: FormData) {
    "use server";

    const email = e.get("email") as string;
    const password = e.get("password") as string;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      redirect("/");
    }
    const isPasswordCorrect = await verifyHash(user?.key, password);
    if (!isPasswordCorrect) redirect("/");
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
    // window.location.href = `/oauth/authorize?email=${email}&password=${password}&state=${
    //   params.get("state") as string
    // }&callback_url=${params.get("callback_url")}`;
  }

  return (
    <>
      <form action={submit}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default Login;
