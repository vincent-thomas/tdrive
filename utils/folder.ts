import { prisma } from "@/clients";

export const createFolder = (
  folderKey: string,
  userId: string,
  parentFolderId: string
) => {
  return prisma.folder.create({
    data: {
      key: folderKey,
      user: {
        connect: {
          id: userId,
        },
      },
      parentFolder: !!parentFolderId
        ? {
            connect: {
              id: parentFolderId,
            },
          }
        : undefined,
    },
  });
};
