import { AResponse } from "@/utils/io";
import { getUser } from "@/utils/user";
import { prisma, s3 } from "@/clients";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env.mjs";

const schema = z.object({
  fileId: z.string().uuid(),
});

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();

  const body = schema.safeParse(reqBody);

  if (!body.success) return AResponse(null, { no: "no" });

  const { data } = body;

  const user = await getUser(cookies());

  const dbFile = await prisma.file.findUnique({
    where: {
      id: data.fileId,
    },
  });

  if (dbFile?.ownedById !== user?.id) return AResponse(null, "not authed");
  if (!dbFile)
    return NextResponse.json({ error: "file not exist" }, { status: 400 });

  const parentFolder = await prisma.file
    .delete({
      where: {
        id: data.fileId,
      },
    })
    .parentFolder();

  const deleteFileCmd = new DeleteObjectCommand({
    Key: `${user?.id}/${data.fileId}`,
    Bucket: env.S3_FILES_BUCKET,
  });
  await s3.send(deleteFileCmd);
  revalidatePath(`/drive/${parentFolder.id}`);

  return AResponse({ ok: true });
};
