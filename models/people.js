const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  dateOfBirth: {
    type: String,
    required: [true, "Please provide date of birth"],
    length: 10,
  },
  gender: {
    type: Boolean,
    required: [true, "Please provide gender"],
  },
  nationality: {
    type: String,
    required: [true, "Please provide nationality"],
  },
});

module.exports = mongoose.model("people", modelSchema);
