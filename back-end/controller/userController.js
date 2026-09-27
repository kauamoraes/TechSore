const userService = require("../service/userService.js")

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userService({
      name,
      email,
      password
  });

  res.status(201).json({ message: "Usuário criado com sucesso" , user})
};

module.exports = register