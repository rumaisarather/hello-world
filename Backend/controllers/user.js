const db = require("../models");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { userValidate } = require("../middleware/index");
const { generateToken } = require("../utils/token");
const jwt = require("jsonwebtoken");
const User = db.user;

async function register(req, res) {
  let { name, email, password, secondary_email } = req.body;
  try {
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "email already taken" });
    const hashedPassword = await hashPassword(password);
    await User.create({
      name,
      email,
      password: hashedPassword,
      secondary_email,
      email_retry: 0,
      email_success: false,
    });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
  }
}

async function login(req, res) {
  let { email, password } = req.body;

  if (!password)
    return res.status(400).json({ message: "Please fill password" });

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).json({ message: "User not found" });

    let isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Reset email_retry after sending the notification
    await user.update({ email_retry: 0, email_success: true });

    let token = generateToken({ role: "user", email, id: user.id });

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

async function updateUser(req, res) {
  try {
    let { id } = req.params;
    let { name, email, password } = req.body;
    let user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let updateUser = {};
    if (name) updateUser.name = name;
    if (email) updateUser.email = email;
    if (password) updateUser.password = password;

    await User.update(updateUser, { where: { id } });
    let updatedUser = await User.findOne({ where: { id } });
    return res
      .status(200)
      .json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (user) {
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
};
