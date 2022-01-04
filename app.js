require("dotenv").config();
const routerUser = require("./routers/user");
const routerAPI = require("./routers/api");
const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const fs = require("fs");
const passport = require("passport");
const session = require("express-session");
const facebookStrategy = require("passport-facebook").Strategy;
const path = require("path");
const connectDB = require("./database/connect");
const app = express();
const key = fs.readFileSync("./cert/CA/localhost/localhost.decrypted.key");
const cert = fs.readFileSync("./cert/CA/localhost/localhost.crt");
const server = https.createServer({ key, cert }, app);
app.set("view engine", "ejs");
// Passport session setup.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: process.env.FB_CALLBACK_URL,
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      // process.nextTick(function () {
      //   //Check whether the User exists or not using profile.id
      //   if (config.use_database) {
      //     //Further code of Database.
      //   }
      //   return done(null, profile);
      // });
      return done(null, profile);
    }
  )
);
app.use(express.static(__dirname + "/public"));
app.use(
  "/scripts",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(session({ secret: process.env.SECRET_KEY }));
app.use(passport.session());
app.use("/api/v1/birthday", routerAPI);
app.use("/", routerUser);

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
