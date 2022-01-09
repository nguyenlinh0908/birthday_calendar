const Account = require("../models/accounts");
const request = require("request");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const login = (req, res) => {
  res.render("login");
};
const register = (req, res) => {
  res.render("register");
};
const createAccount = async (req, res) => {
  const { name, email, password } = req.body;
  const date = new Date();
  const validData = {
    name: name,
    email: email,
    password: password,
    createAt: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
  };
  const accountCreated = await Account.create(validData);
  res.status(StatusCodes.CREATED).json({ accountCreated });
};

const findAccount = async (req, res) => {
  const { email, password } = req.body;
  if (email == "" || password == "") {
    throw new BadRequestError("Please provide email and password");
  }
  const account = await Account.findOne({ email });
  if (!account) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = account.createJWT();
  req.app.set("token", token);
  return res
    .status(StatusCodes.OK)
    .json({ status: true, token: token, message: "Login successfully" })
    //.redirect("/user");
};
module.exports = {
  login,
  register,
  createAccount,
  findAccount,
};
