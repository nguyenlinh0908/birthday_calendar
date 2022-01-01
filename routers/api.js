const express = require("express");
const router = express.Router();
const { getAllBirthday } = require("../controllers/birthday");

router.route("/").get(getAllBirthday);
module.exports = router;
