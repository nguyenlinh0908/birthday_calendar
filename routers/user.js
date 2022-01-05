const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  getBirthdaysOfMonth,
  getAllBirthday,
  createBirthday,
} = require("../controllers/birthday");
const { login, register, createAccount } = require("../controllers/user");
router
  .route("/user")
  .get(getAllBirthday)
  .post(upload.single("avatarFile"), createBirthday);

router.route("/birthdays/month").get(getBirthdaysOfMonth);
// module login
router.route("/login").get(login);
router.route('/register').get(register).post(createAccount)
router
  .route("/auth/facebook")
  .get(passport.authenticate("facebook", { scope: "email" }));
router.route("/auth/facebook/callback").get(
  passport.authenticate("facebook", {
    successRedirect: "/user",
    failureRedirect: "/login",
  })
);
router.route('/logout').get()
module.exports = router;
