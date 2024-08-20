const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const { sendEmail } = require("./services/EmailService");

const app = express();
var corOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

// Middleware
app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
const userRoutes = require("./routes/userRoutes.js");
const notificationRoutes = require("./routes/notificationRoute.js");

app.use("/api", userRoutes);
app.use("/api", notificationRoutes);

// // Testing api
app.post("/test-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email.", error });
  }
});

//  Port
const PORT = process.env.PORT || 8000;

//  Server
app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
