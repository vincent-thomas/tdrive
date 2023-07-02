import { s3 } from "@/clients";
import { env } from "@/env.mjs";
import { getFile } from "@/utils/getContents";
import { getUser } from "@/utils/user";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const streamToString = (stream: NodeJS.ReadableStream): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
export const GET = async (
  req: NextRequest,
  { params }: { params: { fileId: string } }
) => {
  const { fileId } = params;
  const user = await getUser(cookies());
  if (!user) {
    return NextResponse.json(
      { error: "user does not have access to this resource" },
      {
        status: 401,
      }
    );
  }
  const file = await getFile(fileId, user?.id as string);

  try {
    const getFile = new GetObjectCommand({
      Bucket: env.S3_FILES_BUCKET,
      Key: `${user?.id}/${file?.id}`,
    });

    const s3File = await s3.send(getFile);

    const bodyString = await streamToString(
      s3File.Body as NodeJS.ReadableStream
    );
    return new Response(bodyString, {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { no: "no" },
      {
        status: 400,
      }
    );
  }
};
