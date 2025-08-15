import express from "express";
import { PrismaClient } from "@prisma/client";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const prisma = new PrismaClient();

// ==================== Notice section =====================

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
        res.status(201).json({ success: true, message: "Notice created successfully", notice });
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
        res.json({ success: true, notices });
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
        res.json({ success: true, message: "Notice Updated successfully!", updated });
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
        res.json({ success: true, message: "Notice deleted successfully" });
    } catch (error) {
        console.log(error)
    }
});

// ======================== Gallery section ========================

// --------------- Upload Image ----------------------
router.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
        const { title } = req.body;
        const ImageUrl = req.file?.path;
        const imagePublicId = req.file?.filename;

        // Validate input
        if (!title || !ImageUrl) {
            return res.status(400).json({
                success: false,
                message: "Title and image are required",
            });
        }

        // Create new gallery record
        const gallery = await prisma.gallery.create({
            data: {
                title,
                ImageUrl,
                imagePublicId,
            },
        });

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: gallery,
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while uploading image",
            error: error.message,
        });
    }
});

// --------------- Delete Gallery image -------------------
router.delete("/delete-image/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find image in DB
        const galleryItem = await prisma.gallery.findUnique({
            where: { id: parseInt(id) },
        });

        if (!galleryItem) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(galleryItem.imagePublicId);

        // Delete from DB
        await prisma.gallery.delete({
            where: { id: parseInt(id) },
        });

        res.json({success:true, message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }
});


// GET all gallery items
router.get('/allGallery', async (req, res) => {
    try {
        const galleryItems = await prisma.gallery.findMany({
            orderBy: { createdAt: 'desc' } // newest first
        });

        res.status(200).json({
            success: true,
            data: galleryItems
        });
    } catch (error) {
        console.error("Failed to fetch gallery:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load gallery"
        });
    }
});


// ================= Blog section ===================
router.post('/create-blog', upload.single("image"), async (req, res) => {
    try {
        const { title, content, author } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: "title and content required" });
        }

        const imageUrl = req.file?.path;
        const imagePublicId = req.file?.filename;

        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                imageUrl,
                imagePublicId,
                author
            }
        })

        res.status(201).json({ message: "Blog created successfully", success: true, data: blog });
    } catch (error) {
        console.error("Failed to create blog:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create blog!"
        });
    }
});

// =================== UPDATE BLOG ===================
router.put("/update-blog/:id", upload.single("image"), async (req, res) => {
    try {
        const blogId = parseInt(req.params.id, 10);
        const { title, content } = req.body;

        const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        let imageUrl = existingBlog.imageUrl;
        let imagePublicId = existingBlog.imagePublicId;

        if (req.file) {
            // Delete old image from Cloudinary if exists
            if (existingBlog.imagePublicId) {
                await cloudinary.uploader.destroy(existingBlog.imagePublicId);
            }
            imageUrl = req.file.path;
            imagePublicId = req.file.filename;
        }

        const updatedBlog = await prisma.blog.update({
            where: { id: parseInt(blogId, 10) },
            data: { title, content, imageUrl, imagePublicId },
        });

        res.status(200).json({ message: "Blog updated successfully!", success: true, data: updatedBlog });
    } catch (error) {
        console.error("Failed to update blog:", error);
        res.status(500).json({ success: false, message: "Failed to update blog" });
    }
});

// =================== DELETE BLOG ===================
router.delete("/delete-blog/:id", async (req, res) => {
    try {
        const blogId = parseInt(req.params.id, 10);

        const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        // Delete image from Cloudinary if exists
        if (existingBlog.imagePublicId) {
            await cloudinary.uploader.destroy(existingBlog.imagePublicId);
        }

        await prisma.blog.delete({ where: { id: blogId } });

        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Failed to delete blog:", error);
        res.status(500).json({ success: false, message: "Failed to delete blog" });
    }
});

// GET all blogs
router.get('/all-blogs', async (req, res) => {
    try {
        const allBlogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: allBlogs
        });

    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load blogs"
        });
    }
});

export default router