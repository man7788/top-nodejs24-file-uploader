const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create User
exports.createUser = async (email, password) => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });
  return user;
};

// Read User
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

// Create Folder
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
