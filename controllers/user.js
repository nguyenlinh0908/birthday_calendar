const Account = require("../models/accounts");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
//login logout and register
const login = (req, res) => {
  res.render("login");
};
const register = (req, res) => {
  res.render("register");
};
const logout = (req, res)=>{
  req.logout()
  res.redirect('/')
}

// create account
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

  return res.status(StatusCodes.OK).redirect("/user");
};
module.exports = {
  login,
  register,
  createAccount,
  findAccount,
  logout
};
