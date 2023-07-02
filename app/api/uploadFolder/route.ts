import { AResponse } from "@/utils/io";
import { getUser } from "@/utils/user";
import { prisma } from "@/clients";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { createFolder } from "@/utils/folder";
import { revalidatePath } from "next/cache";

const schema = z.object({
  key: z.string(),
  parentFolderId: z.string().uuid().nullish(),
});

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const parse = schema.safeParse(body);
  if (!parse.success) return AResponse(null, "error");
  const user = await getUser(cookies());
  if (!user) {
    return AResponse(null, user);
  }
  // const parentFolderId =
  //   parse.data.parentFolderId === null ? undefined : parse.data.parentFolderId;
  const preFolder = await prisma.folder.findFirst({
    where: {
      key: parse.data.key,
      userId: user?.id,
      parentFolderId: parse.data.parentFolderId,
    },
  });
  if (!preFolder) {
    const folder = await createFolder(
      parse.data.key,
      user?.id as string,
      parse.data.parentFolderId as string
    );

    revalidatePath(`/drive/${parse.data.parentFolderId || "root"}`);

    return AResponse(folder);
  }
  return AResponse(preFolder);
};
