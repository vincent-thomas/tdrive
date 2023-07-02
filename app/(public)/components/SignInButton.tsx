"use client";

import { env } from "@/env.mjs";
import { useCallback, useState } from "react";

export const SignInButton = () => {
  const [state, setState] = useState<string>();
  const genState = useCallback(() => {
    const newState = crypto.randomUUID();
    console.log(newState);
    sessionStorage.setItem("auth_state", newState);
    return newState;
  }, []);

  return (
    <a
      onMouseOver={() => {
        setState(genState());
      }}
      href={`/oauth/authorize?callback_url=${encodeURIComponent(
        `${env.NEXT_PUBLIC_APP_URL}/callback`
      )}&state=${state}`}
    >
      sign in
    </a>
  );
};
