// routes/UserRoutes.js
import express from "express";
import nodemailer from "nodemailer";
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Helpful: verify transporter at startup, logs if auth fails
transporter.verify((err, success) => {
  if (err) {
    console.error("Nodemailer transporter verification failed:", err);
  } else {
    console.log("Nodemailer transporter ready");
  }
});

// contact form submission
router.post("/contact", async (req, res) => {
  const { name, email, subject = "Contact Form", message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Build mail
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    replyTo: email,
    to: process.env.EMAIL_USER,
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p>
         <p><strong>Email:</strong> ${email}</p>
         <p><strong>Message:</strong></p>
         <div>${String(message).replace(/\n/g, "<br>")}</div>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return res
      .status(200)
      .json({ message: "Email sent successfully", messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});


export default router;
