import { env } from "@/env.mjs";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { fromBuffer, toBuffer } from "./serialize";

const IV_LENGTH = 16;
const AUTH_KEY  = env.AUTH_KEY;
const ALGORITHM = 'aes-256-cbc';
const IV_PROTOCOL = "hex";

export const encrypt = (text: string) => {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, AUTH_KEY, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex")
  return `${fromBuffer(iv, IV_PROTOCOL)}:${encrypted}`
}

export const decrypt = (text: string) => {
  const [ivString, msg] = text.split(":") as [string, string];
  const iv = toBuffer(ivString, IV_PROTOCOL);
  const decipher = createDecipheriv(ALGORITHM, AUTH_KEY, iv);
  return decipher.update(msg, "hex", "utf8") + decipher.final('utf8');
}