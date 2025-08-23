const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// User Queries
exports.createUser = async (email, password) => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });
  return user;
};

exports.readUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

exports.readUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
    },
  });
  return user;
};

// Folder Queries
exports.createFolder = async (name, userId, superFolderId) => {
  let folder;
  if (superFolderId) {
    folder = await prisma.folder.create({
      data: {
        name,
        user: { connect: { id: userId } },
        superFolder: { connect: { id: superFolderId } },
      },
    });
  } else {
    folder = await prisma.folder.create({
      data: {
        name,
        user: { connect: { id: userId } },
      },
    });
  }
  return folder;
};

exports.readFolder = async (userId, folderId) => {
  let folder;
  if (folderId) {
    folder = await prisma.folder.findFirst({
      where: {
        id: folderId,
        userId,
      },
      include: { subFolders: true },
    });
  } else {
    folder = await prisma.folder.findFirst({
      where: {
        userId,
        superFolderId: null,
      },
      include: { subFolders: true },
    });
  }
  return folder;
};

exports.deleteFolder = async (userId, folderId) => {
  const folder = await prisma.folder.delete({
    where: {
      id: folderId,
      userId,
    },
  });
  return folder;
};

exports.updateFolder = async (name, userId, folderId) => {
  const folder = await prisma.folder.update({
    where: {
      id: folderId,
      userId,
    },
    data: {
      name,
    },
  });
  return folder;
};

// File Queries
exports.createFile = async (name, path, size, userId, folderId) => {
  const file = await prisma.file.create({
    data: {
      name,
      path,
      size,
      userId,
      folderId,
    },
  });
  return file;
};

exports.readAllFiles = async (userId, folderId) => {
  const files = await prisma.file.findMany({
    where: {
      userId,
      folderId,
    },
  });
  return files;
};
