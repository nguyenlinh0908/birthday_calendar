require("dotenv").config();
const routerUser = require("./routers/user");
const routerAPI = require("./routers/api");
const connect = require('./database/connect')
const express = require("express");
const path = require("path");
const connectDB = require("./database/connect");
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  "/scripts",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use("/api/v1/birthday", routerAPI);
app.use("/", routerUser);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.URL)
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log("connect fail" + error);
  }
};
start();
