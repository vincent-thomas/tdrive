import { prisma } from "@/clients";

export const getContentsFromFolder = async (
  userId: string,
  folderId: string
) => {
  const files = await prisma.file.findMany({
    where: {
      ownedById: userId,
      folderId,
    },
  });
  const folders = await prisma.folder.findMany({
    where: {
      userId,
      parentFolderId: folderId,
    },
  });
  return { files, folders };
};

export const getFolder = async (userId: string, folderId?: string) => {
  return await prisma.folder.findFirst({
    where: {
      id: folderId !== "root" ? folderId : undefined,
      key: folderId === "root" ? folderId : undefined,
      userId,
    },
    include: {
      parentFolder: true,
    },
  });
};

export const getFile = async (fileId: string, userId: string) => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });
  if (file?.ownedById === userId) {
    return file;
  } else return null;
};
