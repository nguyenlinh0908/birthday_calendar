const express = require("express");
const router = express.Router();
const upload = require("../../middleware/uploadMiddleware");

const {
  getAllBirthdayAPI,
  createBirthdayAPI,
  getBirthdayAPI,
  updateBirthdayAPI,
  deleteBirthdayAPI,
} = require("../../controllers/birthday");
router.get("/all", getAllBirthdayAPI);
router.route("/").post(upload.single("avatarFile"), createBirthdayAPI);
router
  .route("/:id")
  .get(getBirthdayAPI)
  .patch(upload.single("avatarFile"), updateBirthdayAPI)
  .delete(deleteBirthdayAPI);
module.exports = router;
