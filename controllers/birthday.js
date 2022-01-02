const request = require("request");
const getAllBirthday = (req, res) => {
  request.get(
    "https://restcountries.com/v3.1/all",
    function (err, response, body) {
      if (!err && response.statusCode == 200) {
       res.render("index", { countries: JSON.parse(body) });
      }
    }
  );
};
const pushBirthday = (req, res) => {
  console.log("push birthday");
};
module.exports = {
  getAllBirthday,
  pushBirthday,
};
