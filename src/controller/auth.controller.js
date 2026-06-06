const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { fullName, mobile, email, password } = req.body;

    if (!fullName || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "fullName, mobile and password are required",
      });
    }

    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered with this mobile number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      mobile,
      email: email || "",
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "login and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: login },
        { mobile: login }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "oldPassword and newPassword are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
};