"use client";

import { utils } from "@/services/utils";
import { useCallback, useState } from "react";

export const SignInButton = () => {
  const [state, setState] = useState<string>();
  const genState = useCallback(() => {
    const newState = crypto.randomUUID();
    sessionStorage.setItem("auth_state", newState);
    return newState;
  }, []);

  return (
    <a
      onMouseOver={() => {
        setState(genState());
      }}
      href={`/oauth/init?callback_url=${encodeURIComponent(
        `${utils.getAppUrl()}/callback`
      )}&state=${state}`}
    >
      sign in
    </a>
  );
};
