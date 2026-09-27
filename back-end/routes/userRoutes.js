const express = require("express");
const register = require("../controller/userController.js")

const router = express.Router();

router.post("/user/register", register)

module.exports = router;
