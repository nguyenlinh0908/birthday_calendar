const Account = require("../models/accounts");
const request = require("request");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
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
module.exports = {
  login,
  register,
  createAccount,
};
