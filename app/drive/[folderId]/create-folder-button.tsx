import { getUser } from "@/utils/user";
import { revalidatePath } from "next/cache";
import { createFolder } from "@/utils/folder";
import { cookies } from "next/headers";

interface CreateFolderI {
  parentFolderId: string;
}

export async function CreateFolderButton(props: CreateFolderI) {
  async function putFolder(data: FormData) {
    "use server";
    const user = await getUser(cookies());
    const folderKey = data.get("folderName") as string;
    await createFolder(folderKey, user?.id as string, props.parentFolderId);
    revalidatePath(`/drive/${props.parentFolderId || "root"}`);
  }

  return (
    <form action={putFolder}>
      <input type="text" name="folderName" />
      <button type="submit">Create Folder</button>
    </form>
  );
}
