const db = require("../models");

const { sendEmail } = require("../services/EmailService");
const Notification = db.notification;

// Create a notification
async function createNotification(req, res) {
  const { user_id, notifications, send_time } = req.body;
  try {
    const notification = await Notification.create({
      user_id,
      notifications,
      send_time,
    });

    // After creating the notification, send an email
    const user = await db.user.findByPk(user_id);
    const result = await sendEmail(
      user.email,
      user.secondary_email,
      "Notification",
      notifications
    );

    // Handle success or failure of email logic
    if (result.success) {
      return res
        .status(200)
        .json({
          message: "Notification sent and email dispatched successfully",
        });
    } else {
      return res
        .status(500)
        .json({
          message: "Notification saved, but email sending failed",
          error: result.message,
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending notification", error: error.message });
  }
}

// Get notification by ID
async function getNotificationById(req, res) {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
  }
}

module.exports = {
  createNotification,
  getNotificationById,
};
