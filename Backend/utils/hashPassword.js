// utils/passwordUtils.js
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing password");
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
