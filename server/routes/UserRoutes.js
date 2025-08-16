// routes/UserRoutes.js
import { PrismaClient } from "@prisma/client"
import express from "express";
import nodemailer from "nodemailer";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import uploadDoc from "../middleware/uploadDoc.js";
import { requireAuth } from "@clerk/express";

const prisma = new PrismaClient();
const router = express.Router();

// -------------------- Nodemailer Setup --------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("Nodemailer transporter verification failed:", err.message, err.stack);
  } else {
    console.log("Nodemailer transporter ready");
  }
});

// -------------------- Contact Form --------------------
router.post("/contact", uploadDoc.single("document"), async (req, res) => {
  const { name, email, subject = "Contact Form", message } = req.body;
  const document = req.file;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

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

  if (document) {
    mailOptions.attachments = [
      {
        filename: document.originalname,
        content: document.buffer, // Assumes memory storage
      },
    ];
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error.message, error.stack);
    return res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// -------------------- Create Team Member --------------------
router.post("/create-member", upload.single("image"), async (req, res) => {
  try {
    const { name, role, description } = req.body;

    let socialLinks = null; // Use null as default
    if (req.body.socialLinks) {
      try {
        socialLinks = JSON.parse(req.body.socialLinks);
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid socialLinks JSON" });
      }
    }

    const imageUrl = req.file?.path;
    const imagePublicId = req.file?.filename;

    const newMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        description: description || null,
        imageUrl,
        imagePublicId,
        socialLinks, // Store the object directly
      },
    });

    res.json({ success: true, member: newMember, message: "New member created" });
  } catch (error) {
    console.error("Error creating team member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- Get All Members --------------------
router.get("/all-members", async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Failed to fetch members" });
  }
});

// ------------------------- Update user detial ----------------

router.put("/update-user/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, description } = req.body;

    let socialLinks = null;
    if (req.body.socialLinks) {
      try {
        socialLinks = JSON.parse(req.body.socialLinks);
      } catch {
        return res
          .status(400)
          .json({ success: false, message: "Invalid socialLinks JSON" });
      }
    }

    const imageUrl = req.file?.path;
    const imagePublicId = req.file?.filename;

    const updatedMember = await prisma.teamMember.update({
      where: { id: parseInt(id) },
      data: {
        name,
        role,
        description: description || null,
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId }),
        socialLinks,
      },
    });

    res.json({ success: true, member: updatedMember, message: "Member updated" });
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// -------------------- Delete Team Member --------------------
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the team member exists
    const member = await prisma.teamMember.findUnique({
      where: { id: parseInt(id) },
    });

    if (!member) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    await cloudinary.uploader.destroy(member.imagePublicId);

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id: parseInt(id) },
    });

    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- Fetch User by Clerk ID --------------------
router.get('/loggedin/:clerkId', requireAuth(), async (req, res, next) => {
  try {
    if (!req.auth) {
      console.error('req.auth is undefined');
      return res.status(401).json({ error: 'Authentication middleware failed' });
    }

    const { clerkId } = req.params;

    // Verify the requesting user matches the clerkId (optional)
    if (req.auth.userId !== clerkId) {
      return res.status(403).json({ error: 'Unauthorized: You can only access your own data' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User fetched successfully', data: user });
  } catch (error) {
    console.error('Error fetching user:', error.message, error.stack);
    next(error); // Pass to global error handler
  }
});

export default router;
