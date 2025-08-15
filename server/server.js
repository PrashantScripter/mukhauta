// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import { PrismaClient } from "@prisma/client";
import { verifyWebhook } from "@clerk/express/webhooks";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ✅ 1) CORS setup for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/**
 * ✅ 2) Clerk Webhook (must be before express.json)
 * - Reads raw body for signature verification
 * - Fetches full user profile from Clerk
 */
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const evt = await verifyWebhook(req, {
        signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
      });

      const userId = evt.data.id;

      // Handle Create & Update
      if (evt.type === "user.created" || evt.type === "user.updated") {
        const u = await clerkClient.users.getUser(userId);

        const clerkId = u.id;
        const email = u.emailAddresses?.[0]?.emailAddress ?? null;
        const firstName = u.firstName ?? null;
        const lastName = u.lastName ?? null;
        const imageUrl = u.imageUrl ?? null;
        const role = u.publicMetadata?.role ?? "user";

        await prisma.user.upsert({
          where: { clerkId },
          update: { email, firstName, lastName, imageUrl, role, deleted: false },
          create: { clerkId, email, firstName, lastName, imageUrl, role },
        });

        console.log(`✅ User ${evt.type} synced to DB: ${clerkId}`);
      }

      // Handle Delete
      if (evt.type === "user.deleted") {
        await prisma.user.updateMany({
          where: { clerkId: userId },
          data: { deleted: true },
        });
        console.log(`🗑️ User marked as deleted in DB: ${userId}`);
      }

      res.status(200).send("ok");
    } catch (err) {
      console.error("❌ Webhook error", err);
      res.status(400).send("webhook verification failed");
    }
  }
);


// ✅ 3) Body parsers AFTER webhook
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4) Protect all routes except webhook with Clerk
app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

/**
 * ✅ 5) Manual sync route for logged-in user
 */
app.get("/api/sync/me", async (req, res) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const u = await clerkClient.users.getUser(auth.userId);

    const clerkId = u.id;
    const email = u.emailAddresses?.[0]?.emailAddress ?? null;
    const firstName = u.firstName ?? null;
    const lastName = u.lastName ?? null;
    const imageUrl = u.imageUrl ?? null;
    const role = u.publicMetadata?.role ?? "user";

    await prisma.user.upsert({
      where: { clerkId },
      update: { email, firstName, lastName, imageUrl, role, deleted: false },
      create: { clerkId, email, firstName, lastName, imageUrl, role },
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("sync/me error", e);
    res.status(500).json({ error: "Internal error" });
  }
});

// ✅ 6) Your app routes
app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);

app.get("/", (req, res) => {
  res.send("Working..");
});

// ✅ 7) Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
