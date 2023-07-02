"use client";

import { env } from "@/env.mjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export const LoginButton = () => {
  const [state, setState] = useState<string>();

  useEffect(() => {
    const newState = crypto.randomUUID();
    setState(newState);
    sessionStorage.setItem("auth_state", newState);
  }, []);

  return (
    <Link
      href={`/oauth/authorize?callback_url=${encodeURIComponent(
        `${env.NEXT_PUBLIC_APP_URL}/callback`
      )}&state=${state as string}`}
    >
      Login
    </Link>
  );
};
