require("dotenv").config();
const nodemailer = require("nodemailer");

const primaryTransport = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.PRIMARY_EMAIL_USER,
    pass: process.env.PRIMARY_EMAIL_PASS,
  },
});

const backupTransport = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.BACKUP_EMAIL_USER,
    pass: process.env.BACKUP_EMAIL_PASS,
  },
});

const MAX_ATTEMPTS = 3;

async function sendEmail(to, secondaryTo, subject, text) {
  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < MAX_ATTEMPTS && !success) {
    try {
      // Try sending the email with the primary transport
      await primaryTransport.sendMail({
        from: process.env.PRIMARY_EMAIL_USER,
        to: to,
        cc: secondaryTo,
        subject: subject,
        html: text,
      });
      success = true;
      console.log("Email sent successfully using primary email.");
      return { success: true };
    } catch (error) {
      console.error(
        `Attempt ${attempts + 1} failed with primary email:`,
        error
      );
      lastError = error;
      attempts++;

      // Switch to backup transport after MAX_ATTEMPTS
      if (attempts >= MAX_ATTEMPTS) {
        attempts = 0;
        while (attempts < MAX_ATTEMPTS && !success) {
          try {
            await backupTransport.sendMail({
              from: process.env.BACKUP_EMAIL_USER,
              to: to,
              cc: secondaryTo,
              subject: subject,
              html: text,
            });
            success = true;
            console.log("Email sent successfully using backup email.");
            return { success: true };
          } catch (backupError) {
            console.error("Backup email service failed:", backupError);
            lastError = backupError;
          }
        }
      }
    }
  }

  if (!success) {
    console.error("All email attempts failed:", lastError);
    return { success: false, message: lastError.message };
  }
}
module.exports = {
  sendEmail,
};
