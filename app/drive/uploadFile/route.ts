import { env } from "@/env.mjs";
import { AResponse } from "@/utils/io";
import { getUser } from "@/utils/user";
import { prisma, s3 } from "@/clients";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const filename = req.nextUrl.searchParams.get("key") as string;
  const parentFolder = req.nextUrl.searchParams.get("parent_folder") as string;
  const fileType = req.nextUrl.searchParams.get("file_type") as string;

  const user = await getUser(cookies());

  // const user = await getUser(cookies());

  const dbParentFolder = await prisma.folder.findFirst({
    where: {
      id: parentFolder,
      userId: user?.id,
    },
  });

  if (!dbParentFolder) {
    return NextResponse.json({ error: "folder not exist" }, { status: 400 });
  }

  const f = await prisma.file.create({
    data: {
      filename,
      fileSize: 0,
      fileType,
      ownedById: user?.id as string,
      parentFolder: {
        connect: {
          id: dbParentFolder.id,
        },
      },
    },
  });

  await s3.putObject({
    Key: `${user?.id as string}/${f.id}`,
    Body: body,
    Bucket: env.S3_UPLOAD_BUCKET,
  });

  return AResponse({ ...f, body: body });
};