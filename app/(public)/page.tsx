import { cookies } from "next/headers";
import { getUser } from "@/utils/user";
import { LoginButton } from "./components/LoginButton";
import { SignInButton } from "./components/SignInButton";
import { env } from "@/env.mjs";

const page = async () => {
  const user = await getUser(cookies());

  return (
    <>
      {JSON.stringify(user)}
      {!user ? (
        <>
          <LoginButton />
          <SignInButton />
        </>
      ) : (
        <>
          <a
            href={`/oauth/logout?callback_url=${encodeURIComponent(
              env.APP_URL
            )}`}
          >
            Logout
          </a>
          <a href={`/drive/root`}>Go to drive</a>
        </>
      )}
    </>
  );
};

export default page;
