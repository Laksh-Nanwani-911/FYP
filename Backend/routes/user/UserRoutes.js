const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  uploadOrUpdateProfileImage,
  updateUserProfile,
} = require("../../controllers/user/UserController");

const { authenticateUser } = require("../../middlewares/Auth");

router.get("/get-profile", authenticateUser, getUserProfile);

router.patch(
  "/update-profile-image",
  authenticateUser,
  uploadOrUpdateProfileImage
);

router.put("/update-profile", authenticateUser, updateUserProfile);

module.exports = router;
