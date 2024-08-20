const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  register,
  login,
} = require("../controllers/user.js");
const { userValidate } = require("../middleware/index");

router.post("/users/register", register);
router.post("/users/login", login);

router.get("/users", userValidate, getAllUsers);
router.put("/users/:id", userValidate, updateUser);
router.delete("/users/:id", userValidate, deleteUser);

module.exports = router;
