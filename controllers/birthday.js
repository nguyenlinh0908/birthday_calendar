const getAllBirthday = (req, res) => {
  res.send("hello word");
};
const pushBirthday = (req, res) => {
  res.render("index");
};
module.exports = {
  getAllBirthday,
  pushBirthday,
};
