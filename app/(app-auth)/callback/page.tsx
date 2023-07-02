"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) throw Error("code_invalid");
    if (state !== null && state !== sessionStorage.getItem("auth_state")) {
      console.error("state invalid");
    }

    fetch(`/oauth/token`, {
      method: "POST",
      body: JSON.stringify({ code }),
    })
      .then((v) => v.json())
      .then((data: { status: "success" }) => {
        if (data.status === "success") {
          sessionStorage.removeItem("auth_state");
          router.replace("/drive");
        } else throw Error("test");
      });
  }, [router, searchParams]);

  return <>loading...</>;
};

export default Page;
