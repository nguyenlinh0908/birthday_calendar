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
const createBirthday = async (req, res) => {
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

// api
const getAllBirthdayAPI = async (req, res) => {
  const birthdays = await People.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ birthdays, count: birthdays.length });
};
const createBirthdayAPI = async (req, res) => {
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
  const userID = req.user.userId;
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
    createdBy: userID,
  };
  const peopleInserted = await People.create(people);
  res.status(StatusCodes.CREATED).json({ peopleInserted });
};
const getBirthdayAPI = async (req, res) => {
  const {
    user: { userId },
    params: { id: birthdayID },
  } = req;
  const birthday = await People.findOne({ _id: birthdayID, createdBy: userId });
  if (!birthday) {
    throw new NotFoundError(`No birthday with id ${birthdayID}`);
  }
  res.status(StatusCodes.OK).json({ birthday });
};

const updateBirthdayAPI = async (req, res) => {
  const {
    body: {
    fullName,
    dateOfBirth,
    gender,
    nationality,
    facebookUrl,
    instagramUrl,
    twitterUrl,
    oldAvatar,
    avatarFile
  } ,
    user: { userId },
    params: { id: birthdayID },
  } = req
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
    console.log(oldAvatar.split("/"));
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

  const birthday = await People.findByIdAndUpdate(
    {
      _id: birthdayID,
      createdBy: userId,
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
    },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ birthday });
};
const deleteBirthdayAPI = async (req, res) => {
  const {
    user: { userId },
    params: { id: birthdayID },
  } = req;

  const birthday = await People.findByIdAndRemove({
    _id: birthdayID,
    createdBy: userId,
  });
  if (!birthday) {
    throw new NotFoundError(`No birthday with id ${birthdayID}`);
  }
  let avatar = birthday.avatar;
  if ("default.jpg".localeCompare(avatar.split("/")[2]) != 0) {
    fs.unlink(path.join("public/" + avatar), function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  }
  res.status(StatusCodes.OK).json(birthday);
};
module.exports = {
  getBirthdaysOfMonth,
  getAllBirthday,
  createBirthday,
  listBirthday,
  deleteBirthday,
  editBirthday,
  getAllBirthdayAPI,
  createBirthdayAPI,
  getBirthdayAPI,
  updateBirthdayAPI,
  deleteBirthdayAPI,
};
