require("dotenv").config();
const routerUser = require("./routers/user");
const routerAPI = require("./routers/api");
const bodyParser = require("body-parser");
const cookieParse = require("cookie-parser");
const express = require("express");
const https = require("https");
const fs = require("fs");
const passport = require("passport");
const session = require("express-session");
const facebookStrategy = require("passport-facebook").Strategy;
const localStrategy = require("passport-local").Strategy;
const Account = require("./models/accounts");
const path = require("path");
const connectDB = require("./database/connect");
const app = express();
// const key = fs.readFileSync("./cert/CA/localhost/localhost.decrypted.key");
// const cert = fs.readFileSync("./cert/CA/localhost/localhost.crt");
// const server = https.createServer({ key, cert }, app);

// defence
const rateLimiter = require("express-rate-limit");

// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//   })
// );

app.set("view engine", "ejs");
// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  Account.findById(id, function (err, account) {
    done(err, account);
  });
});
// passport.use(
//   new facebookStrategy(
//     {
//       clientID: process.env.FB_CLIENT_ID,
//       clientSecret: process.env.FB_CLIENT_SECRET,
//       callbackURL: process.env.FB_CALLBACK_URL,
//       profileFields: [
//         "id",
//         "displayName",
//         "name",
//         "gender",
//         "picture.type(large)",
//         "email",
//       ],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       process.nextTick(function () {
//         //Check whether the User exists or not using profile.id
//         if (config.use_database) {
//           //Further code of Database.
//         }
//         return done(null, profile);
//       });
//       return done(null, profile);
//     }
//   )
// );
passport.use(
  "local",
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      Account.findOne({ email: email }, function (err, account) {
        if (err) {
          return done(err);
        }
        if (!account) {
          return done(null, false);
        }
        if (!account.comparePassword(password)) {
          return done(null, false);
        }
        return done(null, account);
      });
    }
  )
);
app.use(express.static(__dirname + "/public"));
app.use(
  "/scripts",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);

app.use(cookieParse());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false, // Remember to set this
  })
);
app.use(passport.initialize());
app.use(
  passport.session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
    cookie: { maxAge: 60000 },
  })
);
app.use(
  "/api/v1/birthday",
  (req, res, next) => {
    if (!req.route) {
      res.render("errors/error_404");
    } else {
      next();
    }
  },
  routerAPI
);
app.use(
  "/",
  routerUser
);
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.URL);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("connect fail" + error);
  }
};
start();
