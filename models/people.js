const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please provide name"],
  },
  dateOfBirth: {
    type: String,
    required: [true, "Please provide date of birth"],
    length: 10,
  },
  gender: {
    type: String,
    required: [true, "Please provide gender"],
  },
  nationality: {
    type: String,
    required: [true, "Please provide nationality"],
  },
  avatar: {
    type: String,
    default: "images/avatars/default.jpg",
  },
  facebookUrl: {
    type: String,
    default: "#",
  },
  instagramUrl: {
    type: String,
    default: "#",
  },
  twitterUrl: {
    type: String,
    default: "#",
  },
  createdBy: {
    type: String,
    required: [true, "Please provide createBy"],
  }
});

module.exports = mongoose.model("People", peopleSchema);
