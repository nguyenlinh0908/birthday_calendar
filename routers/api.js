const express = require("express");
const router = express.Router();
const { getAllBirthday } = require("../controllers/birthday");
const { loginAPI, createAccount } = require("../controllers/user");
const authenticationUserAPI =  require("../middleware/authentication")

// auth
router.post("/auth/login", loginAPI);
router.post("/auth/register", createAccount);

router.route("/birthdays").get(authenticationUserAPI, getAllBirthday);
module.exports = router;
