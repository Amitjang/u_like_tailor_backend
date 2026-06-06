const express = require("express");

const {
  register,
  login,
  getProfile,
  changePassword,
} = require("../controller/auth.controller");

const router = express.Router();

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

// Get User Profile
router.get("/me/:userId", getProfile);

// Change Password
router.patch("/change-password/:userId", changePassword);

module.exports = router;