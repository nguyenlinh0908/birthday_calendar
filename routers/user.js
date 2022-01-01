const express = require("express");
const router = express.Router();
const { pushBirthday } = require("../controllers/birthday");

router.route("/").get(pushBirthday);
module.exports = router;
