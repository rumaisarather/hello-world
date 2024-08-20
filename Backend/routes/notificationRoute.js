const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotificationById,
} = require("../controllers/notification");
const { userValidate } = require("../middleware/index");

router.post("/notifications", userValidate, createNotification);
router.get("/notifications/:id", getNotificationById);

module.exports = router;
