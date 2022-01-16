const express = require("express");
const router = express.Router();
const { loginAPI, createAccount } = require("../../controllers/user");
// auth
router.post("/login", loginAPI);
router.post("/register", createAccount);
module.exports = router;
