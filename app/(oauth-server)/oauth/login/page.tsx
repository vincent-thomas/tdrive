"use client";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
const Login = () => {
  const params = useSearchParams();
  function submit(e: FormEvent) {
    e.preventDefault();
    const [{ value: email }, { value: password }] = e.target as unknown as [
      { value: string },
      { value: string }
    ];
    window.location.href = `/oauth/authorize?email=${email}&password=${password}&state=${
      params.get("state") as string
    }&callback_url=${params.get("callback_url")}`;
  }

  return (
    <>
      <form onSubmit={submit}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">submit</button>
      </form>
    </>
  );
};

export default Login;
