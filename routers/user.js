const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { getAllBirthday, createBirthday } = require("../controllers/birthday");

router
  .route("/user")
  .get(getAllBirthday)
  .post(upload.single("avatarFile"), createBirthday);
module.exports = router;
