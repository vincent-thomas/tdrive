"use client";

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
      href={`/oauth/login?callback_url=${encodeURIComponent(
        `${window.location.origin}/callback`
      )}&state=${state as string}`}
    >
      Login
    </Link>
  );
};
