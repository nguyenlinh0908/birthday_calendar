const Resize = require("../libraries/resize");
const People = require("../models/people");
const path = require("path");
const passport = require("passport");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const fs = require("fs");
const getBirthdaysOfMonth = async (req, res) => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  if (month < 10) {
    month = `0${month + 1}`;
  }
  const { id, name, email, password, createAt } = req.user;
  try {
    const { month: monthAjax, status: ajaxCall } = req.body;
    ajaxCall ? (month = monthAjax) : (month = month);
  } catch (error) {
    month = month;
  }
  const birthdays = await People.find({
    dateOfBirth: { $regex: `[0-9]{2}\/${month}\/[0-9]{4}` },
    createdBy: id,
  }).exec();
  if (!birthdays) {
    throw new NotFoundError(`No birthday in month ${month}`);
  }
  res.status(StatusCodes.OK).json({ birthdays });
};
const deleteBirthday = async (req, res) => {
  const { birthdayID, oldAvatar } = req.body;
  const { id, name, email, password, createAt } = req.user;

  const birthday = await People.deleteOne({
    _id: birthdayID,
    createdBy: id,
  });
  if ("default.jpg".localeCompare(oldAvatar.split("/")[2]) != 0) {
    fs.unlink(path.join("public/" + oldAvatar), function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  }
  res.status(StatusCodes.OK).json({ status: birthday });
};
const editBirthday = async (req, res) => {
  const {
    id,
    fullName,
    dateOfBirth,
    gender,
    nationality,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    avatarUrl,
    oldAvatar,
  } = req.body;
  const { id: createdBy, name, email, password, createAt } = req.user;
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
  let filename = "";
  if (!req.file) {
    //res.status(401).json({ error: "Please provide an image" });
    filename = oldAvatar.split("/")[2];
  } else {
    filename = await fileUpload.save(req.file.buffer);
    if ("default.jpg".localeCompare(oldAvatar.split("/")[2]) != 0) {
      fs.unlink(path.join("public/" + oldAvatar), function (err) {
        if (err) return console.log(err);
        console.log("file deleted successfully");
      });
    }
  }

  const birthday = await People.updateOne(
    {
      _id: id,
      createdBy: createdBy,
    },
    {
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      gender: gender,
      nationality: nationality,
      avatar: `images/avatars/${filename}`,
      facebookUrl: facebookUrl,
      instagramUrl: instagramUrl,
      twitterUrl: twitterUrl,
    }
  );
  res.status(StatusCodes.OK).json(
    { status: birthday.modifiedCount }
    //   { status: birthdayID }
  );
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
  let filename = "";
  if (!req.file) {
    //res.status(401).json({ error: "Please provide an image" });
    filename = "default.jpg";
  }
  filename = await fileUpload.save(req.file.buffer);

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

const listBirthday = (req, res) => {
  res.render("list");
};
module.exports = {
  getBirthdaysOfMonth,
  getAllBirthday,
  createBirthday,
  listBirthday,
  deleteBirthday,
  editBirthday,
};
