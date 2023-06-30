import { getUser } from "@/utils/user";
import { cookies } from "next/headers";
import Link from "next/link";
import { getContentsFromFolder, getFolder } from "@/utils/getContents";
import { CreateFolderButton } from "./create-folder-button";

import type { ServerPage } from "@/types/page";
import type { File } from "@prisma/client";

const Page = async ({ params }: ServerPage) => {
  const user = await getUser(cookies());
  const folder = await getFolder(user?.id as string, params.folderId as string);
  const { files, folders } = await getContentsFromFolder(
    user?.id as string,
    folder?.id as string
  );
  return (
    <>
      <CreateFolderButton parentFolderId={folder?.id as string} />
      {folder !== null && folder?.parentFolderId !== null && (
        <Link
          href={`/drive/${
            folder.parentFolder?.key === "root" ? "root" : folder.parentFolderId
          }`}
        >
          go back
        </Link>
      )}
      <div>
        <h1>Files</h1>
        <div className="flex gap-4">
          {files.map((v: File) => (
            <a key={v.id} href={`/export-file/${v.id}`}>
              {v.filename}
            </a>
          ))}
        </div>
      </div>
      <div>
        <h1>Folders</h1>
        <div className="flex flex-col gap-4">
          {folders.map((v) => (
            <Link key={v.id} href={`/drive/${v.id}`}>
              {v.key}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
