const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const register = async ({ name, email, password }) => {
  if (password.length < 8) {
    throw new Error("A senha deve ter no minimo 8 caracteres");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

module.exports = register;
