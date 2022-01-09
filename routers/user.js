const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/verifyToken");

const {
  getBirthdaysOfMonth,
  getAllBirthday,
  createBirthday,
} = require("../controllers/birthday");
const {
  login,
  register,
  createAccount,
  findAccount,
} = require("../controllers/user");
router.route('/').get(login)
router
  .route("/user")
  .get(verifyToken, getAllBirthday)
  .post(verifyToken, upload.single("avatarFile"), createBirthday);

router.route("/birthdays/month").get(verifyToken,getBirthdaysOfMonth);
// module login
router.route("/login").get(login).post(findAccount);
router.route("/register").get(register).post(createAccount);
router
  .route("/auth/facebook")
  .get(passport.authenticate("facebook", { scope: "email" }));
router.route("/auth/facebook/callback").get(
  passport.authenticate("facebook", {
    successRedirect: "/user",
    failureRedirect: "/login",
  })
);
router.route("/logout").get();
module.exports = router;
