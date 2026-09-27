const authService = require("../service/authService.js");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authService({ email, password });

    res.status(200).json({ message: "Login Sucessuful", token });
  } catch (error) {
    if (error.message === "Senha ou usuario invalido") {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = login;
