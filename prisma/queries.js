const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (email, password) => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });
  return user;
};
