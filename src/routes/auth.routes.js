const express = require("express");
const { users } = require("../data/store");
const { makeId } = require("../utils/helpers");

const router = express.Router();

router.post("/register", (req, res) => {
  const { fullName, mobile, email, password } = req.body;

  if (!fullName || !mobile || !password) {
    return res.status(400).json({
      success: false,
      message: "fullName, mobile and password are required"
    });
  }

  const alreadyExists = users.find((user) => user.mobile === mobile);
  if (alreadyExists) {
    return res.status(409).json({
      success: false,
      message: "User already registered with this mobile number"
    });
  }

  const newUser = {
    id: makeId("USR"),
    fullName,
    mobile,
    email: email || "",
    password
  };

  users.push(newUser);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: newUser.id,
      fullName: newUser.fullName,
      mobile: newUser.mobile,
      email: newUser.email
    }
  });
});

router.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({
      success: false,
      message: "mobile and password are required"
    });
  }

  const user = users.find(
    (registeredUser) =>
      registeredUser.mobile === mobile && registeredUser.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid mobile or password"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile,
      email: user.email,
      token: `token-${user.id}`
    }
  });
});

router.get("/me/:userId", (req, res) => {
  const user = users.find((item) => item.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: {
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile,
      email: user.email
    }
  });
});

router.patch("/change-password/:userId", (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = users.find((item) => item.id === req.params.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "oldPassword and newPassword are required" });
  }
  if (user.password !== oldPassword) {
    return res.status(401).json({ success: false, message: "Old password is incorrect" });
  }

  user.password = newPassword;
  return res.status(200).json({ success: true, message: "Password updated successfully" });
});

module.exports = router;
