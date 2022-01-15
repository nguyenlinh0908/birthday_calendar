const express = require("express");
const passport = require("passport");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  getBirthdaysOfMonth,
  getAllBirthday,
  createBirthday,
  listBirthday,
  editBirthday,
  deleteBirthday
} = require("../controllers/birthday");
const {
  login,
  register,
  createAccount,
  logout,
} = require("../controllers/user");
const { error_404 } = require("../controllers/error_handler");
router.route("/404").get(error_404);
router.route("/").get(login);
// user permission
router
  .route("/user")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/404");
    }
  }, getAllBirthday)
  .post(
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.redirect("/404");
      }
    },
    upload.single("avatarFile"),
    createBirthday
  );
router.route("/birthdays/month").get(getBirthdaysOfMonth);
router
  .route("/list")
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/404");
    }
  }, listBirthday)
  .post((req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/404");
    }
  }, getBirthdaysOfMonth);
router.route("/user/birthday/edit").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/404");
  }
}, upload.single("avatarFile"),editBirthday);
router.route("/user/birthday/delete").post((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/404");
  }
}, deleteBirthday);
// module login and register
router
  .route("/login")
  .get(login)
  .post(
    passport.authenticate("local", {
      successRedirect: "/user",
      failureRedirect: "/login",
    })
  );
router.route("/logout").get((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/404");
  }
}, logout);
router.route("/register").get(register).post(createAccount);
// login with thirty party account
router
  .route("/auth/facebook")
  .get(passport.authenticate("facebook", { scope: "email" }));
router.route("/auth/facebook/callback").get(
  passport.authenticate("facebook", {
    successRedirect: "/user",
    failureRedirect: "/login",
  })
);
module.exports = router;
