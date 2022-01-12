const Resize = require("../libraries/resize");
const People = require("../models/people");
const path = require("path");
const passport = require("passport");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getBirthdaysOfMonth = async (req, res) => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  if (month < 10) {
    month = `0${month + 1}`;
  }
  const { id, name, email, password, createAt } = req.user;

  const birthdays = await People.find({
    dateOfBirth: { $regex: `[0-9]{2}\/${month}\/[0-9]{4}` },
    createdBy: id,
  }).exec();
  if (!birthdays) {
    throw new NotFoundError(`No birthday in month ${month}`);
  }
  res.status(StatusCodes.OK).json({ birthdays });
};
const getAllBirthday = (req, res) => {
  res.render("index");
};
const createBirthday = async (req, res, next) => {
  const {
    fullName,
    dateOfBirth,
    gender,
    nationality,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    avatarFile,
  } = req.body;
  const { id, name, email, password, createAt } = req.user;
  if (
    fullName === "" ||
    dateOfBirth === "" ||
    gender === "" ||
    nationality === ""
  ) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  // folder upload
  const imagePath = path.resolve("public/images/avatars");
  // call class Resize
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    //res.status(401).json({ error: "Please provide an image" });
    filename = "images/avatars/default.jpg";
  }
  const filename = await fileUpload.save(req.file.buffer);

  const people = {
    fullName: fullName,
    dateOfBirth: dateOfBirth,
    gender: gender,
    nationality: nationality,
    avatar: `images/avatars/${filename}`,
    facebookUrl: facebookUrl,
    instagramUrl: instagramUrl,
    twitterUrl: twitterUrl,
    createdBy: id,
  };
  const peopleInserted = await People.create(people);
  res.status(StatusCodes.CREATED).json({ peopleInserted });
};
module.exports = {
  getBirthdaysOfMonth,
  getAllBirthday,
  createBirthday,
};
