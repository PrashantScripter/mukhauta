import express from "express";
import { PrismaClient } from "@prisma/client";
import upload from "../middleware/upload.js";

const router = express.Router();
const prisma = new PrismaClient();

//-------- Create Notice ------------------
router.post('/create-notice', async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }
        const notice = await prisma.notices.create({
            data: { title, description }
        });
        res.status(201).json({ message: "Notice created successfully", notice });
    } catch (error) {
        console.log(error)
    }
});

// -------------- Get all notices ----------------
router.get('/allNotices', async (req, res) => {
    try {
        const notices = await prisma.notices.findMany({
            orderBy: { createdAt: "desc" }
        });
        res.json(notices);
    } catch (error) {
        console.log(error);
    }
});

// ------------ Update Notice ----------------
router.put("/update-notice/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: "Title and description are required" });
        }

        const existing = await prisma.notices.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existing) {
            return res.status(404).json({ error: "Notice not found" });
        }

        const updated = await prisma.notices.update({
            where: { id: parseInt(id) },
            data: { title, description }
        });
        res.json({ message: "Notice Updated successfully!", updated });
    } catch (error) {
        console.log(error)
    }
});

// -------------- Delete Notices -------------------
router.delete('/delete-notice/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.notices.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existing) {
            return res.status(404).json({ error: "Notice not found" });
        }

        await prisma.notices.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.log(error)
    }
});


// --------------- Upload Image ----------------------

router.post('/upload-image', upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
    } catch (error) {
        console.log(error)
    }
})

export default router